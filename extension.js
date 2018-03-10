function InsideOutApi(url) {
    this.base_url = url;
};

InsideOutApi.prototype = {
    urls: {
        'new_person': 'people/new/{name}',
        'get_person': 'people/{secret}',
        'update_person': 'people/{secret}/set/{attribute}/{value}',
        'new_classroom': 'classrooms/new/{name}',
        'get_classroom': 'classrooms/{secret}',
        'update_classroom': 'classrooms/{secret}/set/{attribute}/{value}',
        'add_person_to_classroom': 'people/{secret}/classroom/{parent_secret}/join'
    },

    // Gets the right URL template and then fills in the placeholders
    // props should be an object like {'secret': 123, 'attribute': 'joy_inside', 'value': 100}
    get_url: function(key, props) {
        var url = this.base_url + this.urls[key];
        Object.keys(props).forEach(function(prop) {
            url = url.replace('{' + prop + '}', props[prop]);
        })
        return url;
    },
    fetch_person: function(url, callback) {
        var self = this;
        $.ajax({
            url: url,
            success: function(person) {
                self.person = person;
                self.person_error = null;
                if (callback) callback();
            },
            error: function(err) {
                self.person_error = err.responseJSON.error;
                if (callback) callback();
            }
        })
    },
    fetch_classroom: function(url, callback) {
        var self = this;
        $.ajax({
            url: url,
            success: function(classroom) {
                self.classroom = classroom;
                self.classroom_error = null;
                if (callback) callback();
            },
            error: function(err) {
                self.classroom_error = err.responseJSON.error;
                if (callback) callback();
            }
        })
    },
    new_person: function(name, callback) {
        var url = this.get_url('new_person', {'name': name});
        this.fetch_person(url, callback);
    },
    get_person: function(secret, callback) {
        var url = this.get_url('get_person', {'secret': secret});
        this.fetch_person(url, callback);
    },
    update_person: function(secret, attribute, value, callback) {
        var url = this.get_url('update_person', {'secret': secret, 'attribute': attribute, 'value': value});
        this.fetch_person(url, callback);
    },
    new_classroom: function(name, callback) {
        var url = this.get_url('new_classroom', {'name': name});
        this.fetch_classroom(url, callback);
    },
    get_classroom: function(secret, callback) {
        var url = this.get_url('get_classroom', {'secret': secret});
        this.fetch_classroom(url, callback);
    },
    update_classroom: function(secret, attribute, value, callback) {
        var url = this.get_url('update_classroom', {'secret': secret, 'attribute': attribute, 'value': value});
        this.fetch_classroom(url, callback);
    },
    add_person_to_classroom(secret, parent_secret, callback) {
        var url = this.get_url('add_person_to_classroom', {'secret': secret, 'parent_secret': parent_secret});
        this.fetch_classroom(url, callback);
    }
}

api = new InsideOutApi("http://159.65.100.62/");

var NOT_IMPLEMENTED = function() {};

(function(ext) {
    ext._shutdown = function() {}
    ext._getStatus = function() { return {status: 2, msg: 'Ready'};}

    // classroom
    ext.person_ok = function() { return !api.person_error;}
    ext.classroom_ok = function() { return !api.classroom_error;}
    ext.person_error_message = function() { return api.person_error || "";}
    ext.classroom_error_message = function() { return api.classroom_error || "";}
    ext.classroom_name = function() { return api.classroom ? api.classroom.name : "";}
    ext.classroom_secret = function() { return api.classroom ? api.classroom.secret : "";}
    ext.get_average_feelings = function(feel, inout) { return api.classroom ? api.classroom[feel+'_'+inout] : '';}
    ext.new_classroom = api.new_classroom.bind(api);
    ext.add_person_to_classroom = api.add_person_to_classroom.bind(api);
    ext.get_classroom = api.get_classroom.bind(api);
    ext.update_classroom = api.get_classroom.bind(api);
    ext.exit_classroom = NOT_IMPLEMENTED;
	ext.get_student_ID_string = function() { 
	if (!api.clasroom) {
		return "";
	}
	if (api.classroom.people_json.length == 0){
		return "";
	}
	var string= "";
	for (var person in api.classroom.person_json){
		string= string+person.secret;
	}
	return string;
	}
	
	
    // pet
    ext.get_pet_needs = function(need) { return api.classroom ? api.classroom[need] : ''; }
    ext.get_pet_name = function() { return api.classroom ? api.classroom.pet_name : ''; }
    ext.update_pet = NOT_IMPLEMENTED;
    ext.set_pet_name = NOT_IMPLEMENTED;
    ext.add_pet_need = NOT_IMPLEMENTED;
    ext.switch_pet_needs = NOT_IMPLEMENTED;

    // activities
    ext.show_all_activities = NOT_IMPLEMENTED;
    ext.add_activity = NOT_IMPLEMENTED;
    ext.delete_activity = NOT_IMPLEMENTED;
    ext.prompt_activity = NOT_IMPLEMENTED;
    ext.prompt_random_activity = NOT_IMPLEMENTED;

    // avatar
    ext.get_avatar_name = function() { return api.person ? api.person.name : ''; }
    ext.get_avatar_secret = function() { return api.person ? api.person.secret : ''; }
    ext.get_avatar_feelings = function(feel, inout) { return api.person ? api.person[feel+'_'+inout] : ''; }
    ext.new_teacher = NOT_IMPLEMENTED;
    ext.new_person = api.new_person.bind(api);
    ext.get_person = api.get_person.bind(api);
    ext.update_person = function(feel, inout, value, secret, callback) { api.update_person(secret, feel+'_'+inout, value, callback);}
	ext.get_classrom_feelings = function(feel, inout) { return api.classroom ? api.classroom[feel+'_'+inout] : ''; }
	

    // Block and block menu descriptions
    var descriptor = {
        blocks: [

            // classroom
            ['b', 'avatar ok', 'person_ok'],
            ['b', 'classroom ok', 'classroom_ok'],
            ['r', 'person error message', 'person_error_message'],
            ['r', 'classroom error message', 'classroom_error_message'],
            ['r', 'classroom name', 'classroom_name'],
            ['r', 'classroom id', 'classroom_secret'],
            ['r', 'average %m.attribute %m.in_out for classroom', 'get_classroom_feelings','joy','inside'] ,
			['r', '%m.attribute %m.in_out for person', 'get_avatar_feelings','joy','inside'] ,
            ['w', "start new classroom %s", 'new_classroom'], // teacher-only
            ['w', "%n enters classroom %n", 'add_person_to_classroom'],
            ['w', "show classroom %n", 'get_classroom'], 
            ['w', "update all feelings in classroom %n", 'update_classroom'],
            ['w', "exit classroom %n", 'exit_classroom'],
			['r', 'student ID string', 'get_student_ID_string'],
			
            // pet
            ['r', '%m.petneeds_noun levels', 'get_pet_needs','food'],
            ['r', 'pet name', 'get_pet_name'],
            ['w', "give %n units of %m.petneeds_noun to pet in classroom %n", 'update_pet', 1, 'food'], 
            ['w', "name classroom pet %n", 'set_pet_name','name'], // teacher-only
            ['w', "add %m.petneeds_noun need at %m.times", 'add_pet_need', 'food', '2pm'], // teacher-only
            ['w', "switch %m.petneeds_noun need %m.on_off", 'switch_pet_needs', 'food', 'on'], // teacher-only

            // activities
            ['w', "All activities", 'show_all_activities'],
            ['w', "Add following activity: %n targeted towards %m.attributes with rules: %n", 'add_activity','game name','sadness', 'description'], // teacher-only
            ['w', "Delete activity %m.all_activities", 'delete_activity'], // teacher-only
            ['w', "Prompt activity %m.all_activities", 'prompt_activity'], // teacher-only
            ['w', "Prompt random activity", 'prompt_random_activity'],

            // 2. avatar-program
            ['r', 'avatar name', 'get_avatar_name'],
            ['r', 'avatar id', 'get_avatar_secret'],
            ['w', "sign up as teacher %n", 'new_teacher','name'], // teacher-only
            ['w', "sign up as %s", 'new_person','name'],
            ['w', "sign in as %n", 'get_person'],
            ['w', "set %m.attribute %m.in_out to %n for avatar %n", 'update_person', 'joy', 'inside', 5],
			
        ],
    
        menus: {
            'petneeds_noun': ['food', 'water'],
            'attribute': ['joy', 'anger', 'fear', 'sadness', 'disgust'],
            'in_out': ['inside', 'outside'],
            'all_activities': ['this', 'that']
        }
    };

    // Register the extension
    ScratchExtensions.register('InsideOut extension', descriptor, ext);
})({});
