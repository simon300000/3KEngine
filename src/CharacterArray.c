/*This program reads the total character image on a certain dir and returns
with certain array for engine to load. Still working on it. */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/types.h>

struct dirent *read_dir(DIR *dirp) {
  /* data */
};

int main(int argc, char const *argv[]) {
  DIR *dir_info;

  dir_info = opendir(/*Where image is located*/);
  if(NULL != dir_info){
    while (dir_entry = read_dir(dir_info)) {
      /* code */
    }
    closedir(dir_info);
  }

  return 0;
}

// Not completed.
