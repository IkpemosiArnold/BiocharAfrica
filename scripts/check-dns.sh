#!/usr/bin/env bash
# Cutover checker for biocharsolutions.africa.
#
# Run before, between and after each phase of docs/DNS-CUTOVER.md. It answers the
# only question that matters during a cutover: is email still safe, and has the
# website moved yet.
#
# Queries an authoritative nameserver by default so results are not masked by a
# stale local resolver cache. Pass --cached to see what a normal visitor sees.

set -uo pipefail

DOMAIN="biocharsolutions.africa"
MAIL_IP="131.153.147.50"

RESOLVER="@nsa.whogohost.com"
LABEL="authoritative (nsa.whogohost.com)"
if [ "${1:-}" = "--cached" ]; then
  RESOLVER=""
  LABEL="your local resolver (what visitors see)"
fi

q() { dig +short $RESOLVER "$2" "$1" 2>/dev/null | tr '\n' ' ' | sed 's/ $//'; }

pass=0; fail=0; warn=0
ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); }
no()   { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); }
hmm()  { printf '  \033[33mWARN\033[0m  %s\n' "$1"; warn=$((warn+1)); }

echo "Checking $DOMAIN via $LABEL"
echo

# ---------------------------------------------------------------- email ------
echo "EMAIL (must stay working at every stage)"

MX=$(q MX "$DOMAIN")
echo "        MX = ${MX:-<none>}"
case "$MX" in
  *"mail.$DOMAIN"*)
    ok "MX points at mail.$DOMAIN, decoupled from the apex" ;;
  *"0 $DOMAIN."*|*" $DOMAIN."*)
    hmm "MX still points at the APEX. Safe ONLY while the apex still points at
              the mail server. Do Phase 1 before touching the website." ;;
  "")
    no "no MX record at all, inbound mail is broken" ;;
  *)
    hmm "MX is something unexpected, check it by hand" ;;
esac

MAIL_CNAME=$(q CNAME "mail.$DOMAIN")
MAIL_A=$(q A "mail.$DOMAIN")
if [ -n "$MAIL_CNAME" ]; then
  hmm "mail.$DOMAIN is a CNAME -> $MAIL_CNAME (it will follow the apex; make it an A record)"
elif [ "$MAIL_A" = "$MAIL_IP" ]; then
  ok "mail.$DOMAIN is an A record -> $MAIL_IP"
else
  no "mail.$DOMAIN resolves to '${MAIL_A:-<none>}', expected $MAIL_IP"
fi

SPF=$(dig +short $RESOLVER TXT "$DOMAIN" 2>/dev/null | grep -i 'v=spf1' | tr -d '"')
if [ -z "$SPF" ]; then
  no "no SPF record"
else
  case "$SPF" in
    *"ip4:$MAIL_IP"*) ok "SPF authorises the real mail server explicitly" ;;
    *) no "SPF does not contain ip4:$MAIL_IP" ;;
  esac
  case "$SPF" in
    *"+a "*|*" a "*)
      hmm "SPF still contains '+a'. Once the apex points at Vercel this
              authorises Vercel to send mail as you. Remove it." ;;
    *) ok "SPF has no bare '+a' term" ;;
  esac
fi

[ -n "$(dig +short $RESOLVER TXT "default._domainkey.$DOMAIN" 2>/dev/null)" ] \
  && ok "DKIM key present" || no "DKIM key missing at default._domainkey"

if [ -n "$(dig +short $RESOLVER TXT "_dmarc.$DOMAIN" 2>/dev/null)" ]; then
  ok "DMARC present"
else
  hmm "no DMARC record (not blocking, but worth adding: see the runbook)"
fi

for h in webmail cpanel autodiscover; do
  v=$(q A "$h.$DOMAIN")
  [ "$v" = "$MAIL_IP" ] && ok "$h -> $MAIL_IP" || hmm "$h -> ${v:-<none>} (expected $MAIL_IP)"
done

# -------------------------------------------------------------- website ------
echo
echo "WEBSITE"

APEX=$(q A "$DOMAIN")
echo "        apex A = ${APEX:-<none>}"
if [ "$APEX" = "$MAIL_IP" ]; then
  echo "        -> still on the old WhoGoHost server (pre-cutover)"
  case "$MX" in
    *"mail.$DOMAIN"*) ok "apex is free to move: email no longer depends on it" ;;
    *) hmm "apex not moved yet, and email still depends on it. Phase 1 first." ;;
  esac
elif [ -n "$APEX" ]; then
  echo "        -> moved off the old server"
  case "$MX" in
    *"mail.$DOMAIN"*) ok "apex moved AND email is decoupled" ;;
    *) no "APEX HAS MOVED WHILE MX STILL POINTS AT IT. INBOUND MAIL IS BROKEN.
              Revert the apex A to $MAIL_IP right now, then do Phase 1." ;;
  esac
else
  no "apex has no A record"
fi

WWW_C=$(q CNAME "www.$DOMAIN")
echo "        www = ${WWW_C:-$(q A "www.$DOMAIN")}"

# ------------------------------------------------------------------ live -----
echo
echo "LIVE RESPONSE"
for host in "$DOMAIN" "www.$DOMAIN"; do
  # Follow redirects. Vercel serves the apex as a 308 to www by design, so the
  # landing status is what matters, not the first hop.
  code=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 20 "https://$host/" 2>/dev/null)
  final=$(curl -sL -o /dev/null -w '%{url_effective}' --max-time 20 "https://$host/" 2>/dev/null)
  if [ "$code" = "200" ]; then
    if curl -sL --max-time 20 "https://$host/" 2>/dev/null | grep -qi "rooted in African soil"; then
      if [ "$final" = "https://$host/" ]; then
        ok "https://$host serves the NEW site (200)"
      else
        ok "https://$host -> $final serves the NEW site (200)"
      fi
    else
      hmm "https://$host returns 200 but does not look like the new site"
    fi
  else
    no "https://$host returned '${code:-no response}'"
  fi
done

echo
echo "  $pass passed, $warn warnings, $fail failures"
[ "$fail" -gt 0 ] && exit 1 || exit 0
