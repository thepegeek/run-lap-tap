To get started

```
open app.html
```

It is a javascript and html app.

There is a "Add Name", "Start Race" and "End Race" buttons
The tracker allows you to add the names of competitors to the race – there should be no limit on the number of competitors:

-----------------------------------------------------------------
Name	|Lap Count	|Total Time	|Average Time	|Last Lap Time	|
--------|-----------|-----------|---------------|---------------|
William	|0			|0			|0				|0				|
Harry	|0			|0			|0				|0				|
Charlie	|0			|0			|0				|0				|
-----------------------------------------------------------------

Once you have added all competitors, clicking “Start Race” should start the race timer and display the start date/time on screen next to the race control buttons.

Name is clickable once race started. Once the race is started, clicking on the name of a competitor will mark them as completing a lap. Once they have completed a lap, the following statistics about them should be updated and displayed:
1.	The total number of laps they have completed to that point
2.	The total time they have taken to that point (presented in mm:ss.sss format, where mm is minutes, ss is seconds, and sss is milliseconds)
3.	The average time for their laps, this is total time divided by lap count, so for example if they have taken 1 minute to complete 3 laps, their average time is 20 seconds, which should be shown as 0:20.000
4.	The time taken for their last completed lap, again presented in mm:ss.sss format

-----------------------------------------------------------------
Name	|Lap Count	|Total Time	|Average Time	|Last Lap Time	|
--------|-----------|-----------|---------------|---------------|
William	|5			|00:17.831	|00:03.566		|00:03.752		|
Harry	|5			|00:18.519	|00:03.704		|00:03.432		|
Charlie	|5			|00:19.088	|00:03.818		|00:03.209		|
-----------------------------------------------------------------

There should be no limit on the number of laps that competitors complete. Once the race has finished, clicking End Race should display the following statistics below the race controls:
1.	The name of the competitor that had the highest lap count and lowest overall time
	in the above case, William is the winner with average time 00:03.566
2.	The name of the competitor with the fastest (completed) lap and the time taken for it
