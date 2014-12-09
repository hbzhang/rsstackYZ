## Module name
Class

## Modules definition
### Class module
1. View all the classes.
2. Edit a class.

### Class admin module
1. Create a class.
2. Assign instructors.
3. Manage the feedbacks.

## Roles definition
### Admin
1. Admins can modify one user's role.
2. Admins can see the entry of creating a class and create a class.
3. Admins can delete feedbacks.

### Instructor
1. Instructors can only edit his own classes.
2. Instructors cannot edit or delete the feedbacks of his classes.
3. Instructors cannot change the instructor of his classes.

### Student
1. Students can join a class.

## Class definition
A class will have the following features.

1. Title: The name of the class.
2. Description: The detail of the class.
3. Instructor: The instructor of the class.
4. Students: Current students.
5. Start date: First day of the class.
6. End date: Last day of the class.
7. Capacity: The maxium students allowed in this class.
8. Feedback: Feedbacks regarding to this class.
9. Syllabus: Files uploaded by the instructor regarding to this class.
10. Location: The classroom where the class is held.

### Something unclear
How to define the "attendance"?

## Data models
### Class

    var ClassSchema = new Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        instructor: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        students: [{
            type: Schema.ObjectId,
            ref: 'User'
        }],
        startdate: {
            type: Date
        },
        enddate: {
            type: Date
        },
        capacity: {
            type: Number
        },
        location: {
            type: String
        },
        syllabus: [{
            type: Schema.ObjectId,
            ref: 'Upload'
        }]
    });

#### Notes
1. Class model itself doesn't have the feedback and syllabus fields, instead they are queried using the id of the class, see the definition of Feedback and Uploads.

### Feedback

    var FeedbackSchema = new Schema({
        owner: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        class_: {
            type: Schema.ObjectId,
            ref: 'Class'
        },
        date: {
            type: Date,
        },
        content: {
            type: String
        }
    });

#### Notes
1. The date of the feedback is assigned at the time right before it is saved into the database, no user can modify it.

### Uploads

    var UploadsSchema = new Schema({
        owner: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        class_: {
            type: Schema.ObjectId,
            ref: 'Class'
        },
        filename: {
            type: String
        },
        fileid: {
            type: Schema.ObjectId
        }
    });

#### Notes
1. The files are stored in the database (MongoDB).
2. Duplicated files are allowed.
3. Different files might have the same name, but they are assigned with different ids in the database by the database driver. The files under a certain class are queried using the id of the class.

## RESTful API
Basically the definition of route module in express.js.

### Login

1. POST /login

    
    Sample POST: {email:"8@8.com", password:"123123123"}
    * Password is in plain text, will change it to md5 later
    * Set a cookie fields with the post request: connect.sid={any random string}
    * After a successful verification, all the requests must come with the cookie set previously.

### Feedbacks

1. Get feedbacks of a class.

GET /feedback/view/:classId

    Sample Response: {"__v":0,"date":"2014-08-29T13:46:06.785Z","owner":"539f22d07fbfff881de7f5c0","class_":"53fdfc5f525da6fddfa7f5c9","content":"asdfasdfasdf","_id":"5400841e250fea00001f070a"}

2. Create a feedback.


POST /feedback


    Sample post: {"owner":"539f22d07fbfff881de7f5c0","class_":"53fdfc5f525da6fddfa7f5c9","content":"asdfasdfasdf"}


    Sample Response: {"__v":0,"date":"2014-08-29T13:46:06.785Z","owner":"539f22d07fbfff881de7f5c0","class_":"53fdfc5f525da6fddfa7f5c9","content":"asdfasdfasdf","_id":"5400841e250fea00001f070a"}

3. Delete a feedback.

DELETE /feedback/:feedbackId

    Sample Response: {"__v":0,"date":"2014-08-29T13:46:06.785Z","owner":"539f22d07fbfff881de7f5c0","class_":"53fdfc5f525da6fddfa7f5c9","content":"asdfasdfasdf","_id":"5400841e250fea00001f070a"}

### Uploads

1. Get a file.

GET /upload/:fileId

2. Upload a file.

POST /upload

    Sample Response: {"__v":0,"filename":"croped.png","fileid":"540083f0250fea00001f0707","owner":"539f22d07fbfff881de7f5c0","_id":"540083f0250fea00001f0709"}

3. Delete a file.

DELETE /upload/:fileId

    Sample Response: {"__v":0,"filename":"croped.png","fileid":"540083f0250fea00001f0707","owner":"539f22d07fbfff881de7f5c0","_id":"540083f0250fea00001f0709"}

#### Notes
1. File is uploaded in multi-part.

### Classes
0. Get all classes

GET /class

    Sample Response: [{
                          "_id":"53fdfc5f525da6fddfa7f5c9",
                          "title":"adsf",
                          "description":"asdf",
                          "location":"adsf",
                          "startdate":"2014-08-04T04:00:00.000Z",
                          "enddate":"2014-10-06T04:00:00.000Z",
                          "weektime":"2014-08-27T15:40:48.634Z",
                          "capacity":123,
                          "instructor":{
                              "_id":"53a2f1ecdaa05ca715458b2b",
                                "name":"Keal",
                                "username":"keal"
                          },
                          "thumbnail":{
                                "_id":"53fdfc52525da6fddfa7f5c7",
                                "filename":"croped.png",
                                "fileid":"53fdfc52525da6fddfa7f5c5",
                                "owner":"539f22d07fbfff881de7f5c0",
                                "__v":0
                          },
                          "__v":5,
                          "emailtemplate":"hahahahahhahahahahahhahahhahahahahaha",
                          "syllabus":[],
                          "exclusiondates":["2014-08-25T04:00:00.000Z","2014-10-06T04:00:00.000Z"],
                          "alldates":["2014-08-04T04:00:00.000Z","2014-08-11T04:00:00.000Z","2014-08-18T04:00:00.000Z","2014-08-25T04:00:00.000Z","2014-09-01T04:00:00.000Z","2014-09-08T04:00:00.000Z","2014-09-15T04:00:00.000Z","2014-09-22T04:00:00.000Z","2014-09-29T04:00:00.000Z","2014-10-06T04:00:00.000Z"],
                          "weekdays":[1],
                          "students":[{"_id":"539f22d07fbfff881de7f5c0","username":"wyz2014","name":"yuzhong"}]
                      }]

1. Get a class

GET /class/:classId

    Sample Response: {
                          "_id":"53fdfc5f525da6fddfa7f5c9",
                          "title":"adsf",
                          "description":"asdf",
                          "location":"adsf",
                          "startdate":"2014-08-04T04:00:00.000Z",
                          "enddate":"2014-10-06T04:00:00.000Z",
                          "weektime":"2014-08-27T15:40:48.634Z",
                          "capacity":123,
                          "instructor":{
                              "_id":"53a2f1ecdaa05ca715458b2b",
                                "name":"Keal",
                                "username":"keal"
                          },
                          "thumbnail":{
                                "_id":"53fdfc52525da6fddfa7f5c7",
                                "filename":"croped.png",
                                "fileid":"53fdfc52525da6fddfa7f5c5",
                                "owner":"539f22d07fbfff881de7f5c0",
                                "__v":0
                          },
                          "__v":5,
                          "emailtemplate":"hahahahahhahahahahahhahahhahahahahaha",
                          "syllabus":[],
                          "exclusiondates":["2014-08-25T04:00:00.000Z","2014-10-06T04:00:00.000Z"],
                          "alldates":["2014-08-04T04:00:00.000Z","2014-08-11T04:00:00.000Z","2014-08-18T04:00:00.000Z","2014-08-25T04:00:00.000Z","2014-09-01T04:00:00.000Z","2014-09-08T04:00:00.000Z","2014-09-15T04:00:00.000Z","2014-09-22T04:00:00.000Z","2014-09-29T04:00:00.000Z","2014-10-06T04:00:00.000Z"],
                          "weekdays":[1],
                          "students":[{"_id":"539f22d07fbfff881de7f5c0","username":"wyz2014","name":"yuzhong"}]
                      }

2. Create a class

POST /class

    Sample Post: {
                    "title":"asdf",
                    "description":"asdf",
                    "location":"asdf",
                    "startdate":"2014-08-04T04:00:00.000Z",
                    "enddate":"2014-08-26T04:00:00.000Z",
                    "emailtemplate":"adsf",
                    "exclusiondates":["2014-08-05T04:00:00.000Z","2014-08-11T04:00:00.000Z"],
                    "weekdays":[1,2],
                    "weektime":"2014-08-29T14:04:24.121Z",
                    "capacity":123,
                    "instructor":"53a2f218daa05ca715458b2d",
                    "thumbnail":"5400878d250fea00001f070d",
                    "syllabus":[]
                  }

* exclusion dates, startdate and enddate must be on the specified weekdays.

3. Update a class

PUT /class/:classId

    Sample PUT: * Same as creating a class.

4. List classes by instructor

GET /class/instructor/:instructorId

    Sample Response: * Same as getting all classes.

5. List classes by student

GET /class/student/:studentId

    Sample Response: * Same as getting all classes.

6. List classes by location

GET /class/location/:location

    Sample Response: * Same as getting all classes.

7. List classes by date

GET /class/date/:timestamp

    Sample Response: * Same as getting all classes.

* The timestamp field is the UNIX timestamp.

8. Join a class

GET /class/join/:classId

    Sample Response: * Same as getting one class.

* The current logged in user will join the class.

9. Add an attendance

POST /attendance

    Sample POST: {
                    student: "53a2ef0edaa05ca715458b2a",
                    class_: "53fdfc5f525da6fddfa7f5c9",
                    date: "2014-10-06T04:00:00.000Z"
                 }

* If the student is not in the class, or no class on the specified date, an error 500 will be returned.

10. List the attendance by class

GET /attendance/:classId

    Sample Response: [{
                        student: "53a2ef0edaa05ca715458b2a",
                        class_: "53fdfc5f525da6fddfa7f5c9",
                        date: "2014-10-06T04:00:00.000Z"
                     }]

### Instructor
1. Get all the instructors

GET /instructor

    Sample Response: [{
                         "_id":"53a2ef0edaa05ca715458b2a",
                         "email":"1@2.com",
                         "name":"BiuBiu",
                         "username":"biubiu"}]
