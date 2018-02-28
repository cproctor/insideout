Username
Anger-inside
Anger-outside
Joy-inside
Joy-outside
Fear-inside
Fear-outside
Disgust-inside
Disgust-outside
Sadness-inside
Sadness-outside

petID
petName

classroomID
joy-avg-inside
joy-avg-outside
anger-avg-inside
anger-avg-outside
Fear-avg-inside
Fear-avg-outside
Disgust-avg-inside
Disgust-avg-outside
Sadness-avg-inside
Sadness-avg-outside

Available routes

Avatar:
/players/new/NAME (creating a new avatar)
/players/PID (accessing existing avatar)
/players/PID/history (tracks all emotional history)
/players/PID/set/joy-inside (Ideally this happens automatically, so that the data gets transferred from your PID when you joint a classroom)
/players/PID/set/joy-outside 
/players/PID/set/anger-inside 
/players/PID/set/anger-outside 
/players/PID/set/fear-inside 
/players/PID/set/fear-outside 
/players/PID/set/sadness-inside 
/players/PID/set/sadness-outside 
/players/PID/set/disgust-inside 
/players/PID/set/disgust-outside 

/players/PID/petID/feed
/players/PID/petID/play
/players/PID/petID/water


Classroom:
/classroom/CID (seeing everyone who's in there)
/players/PID/classroom/new (Teacher is setting up a new classroom)
/players/PID/classroom/CID/join (certain PID/child joins the classroom with their avatar)

Classpet:
/classpet/new/name (creating a class pet)
/players/PID/classpet/petID/feed
/players/PID/classpet/petID/water
/players/PID/classpet/petID/play
/classpet/petID (accessing state of the pet)
