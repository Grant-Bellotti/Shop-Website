let socket = io();
socket.on('welcome', function(message) {
    //checks if user is authenticated, if they aren't then authenticate them
    $.ajax({
        url: "/checkAuthenticated",
        type: "GET",
        async: true,
        data: { },
        success: function(data1){
            if (data1.error == false) {

            } 
            else {
                //authenticate user and reload page to avoid any issues
                console.log(data1.error);
                $.post("/authenticate",{ username: message.id, password:'bob' },function(data2) {
                    location.reload();
                });
            }
        },
        dataType: "json"
    });
});