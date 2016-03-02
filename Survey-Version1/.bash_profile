function parse_git_branch {

        git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ \[\1\]/'

}

LIGHT_GRAY="\[\033[1;37m\]"
LIGHT_RED="\[\033[1;31m\]"
DEFAULT="\[\033[0m\]"
GREEN="\[\033[0;32m\]"
LIGHT_GREEN="\[\033[1;32m\]"


PS1="$GREEN\$(date +%H:%M) $DEFAULT\u@\h:\w$LIGHT_RED\$(parse_git_branch)$DEFAULT\$ "
