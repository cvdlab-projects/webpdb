#!/bin/sh
# This script iterates for every MAIN subdir of the project
# and checks for ".module" files to install depencies for
# the custom module

CURRENTDIR=$(pwd)
MODULEFILE=".module"

parse_module_npm ()
{
  if [ -z "$1" ]
   then
     return 1
   else
      cat $1 | while read CURRLINE; do
	if [ -n "$CURRLINE" ]
	  then
	    if [ "#" != "$(echo "$CURRLINE" | cut -b 1)" ]
	      then
		# Run npm install
		echo "Installing module $CURRLINE"
		npm install $CURRLINE
	    fi
	  fi
      done
      return 0
   fi
}

# Just to be sure
cd $CURRENTDIR

# foreach subidr
for NEWDIR in $(ls -d */)
do
  if [ -f "$CURRENTDIR/$NEWDIR$MODULEFILE" ]
  then
    cd $CURRENTDIR/$NEWDIR
    echo "Found module file for $NEWDIR"
    parse_module_npm "$CURRENTDIR/$NEWDIR$MODULEFILE"
    echo "------------------------------------------"
  fi
done

cd $CURRENTDIR