#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    /* { year: 2023, month: 11, day: 11, hour: 15, minute: 45, second: 47 } */
    struct tm times;
    int Year = 2023;
    int Month = 11;
    int Day = 11;
    int Hour = 15;
    int Minute = 59;
    int Second = 31;

    times.tm_year   = (Year) - 1900;
    times.tm_mon    = (Month) - 1;
    times.tm_mday   = (Day);
    times.tm_hour   = (Hour);
    times.tm_min    = (Minute);
    times.tm_sec    = (Second);
    uint64_t timesss = (uint64_t)mktime(&times);


    printf ("%llu\n", timesss);

    return 0;
}
