/**
 * @name handleFail
 * @param err - error thrown by any function
 * @description Helper function to handle errors
 */
let handleFail = function(err){
    console.log("Error : ", err);
};

// Queries the container in which the remote feeds belong
let remoteContainer = document.getElementById("remote-container");

/**
 * @name addVideoStream
 * @param streamId
 * @description Helper function to add the video stream to "remote-container"
 */
function addVideoStream(streamId){
    let streamDiv = document.createElement("div"); // Create a new div for every stream
    streamDiv.id = streamId;                       // Assigning id to div
    streamDiv.style.transform = "rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
    remoteContainer.appendChild(streamDiv);      // Add new div to container
}
/**
 * @name removeVideoStream
 * @param evt - Remove event
 * @description Helper function to remove the video stream from "remote-container"
 */
function removeVideoStream (evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
    console.log("Remote stream is removed " + stream.getId());
}

// Start code
//Creating client
let client = AgoraRTC.createClient({
    mode : 'live',
    codec : "h264"
});

//Initializing client
client.init("<add your app id>", function(){
    console.log("Initialized successfully!");
});

//Joining the client
client.join(null, 'video-demo', null, function(uid){

    let localstream = AgoraRTC.createStream({
        streamID : uid,
        audio : false,
        video : true,
        screen : false
    });

    //Publishing the stream.
    localstream.init(function(){
        localstream.play('me');
        client.publish(localstream, handleFail);

        client.on('stream-added', (evt)=>{
            client.subscribe(evt.stream,handleFail);
        });

        client.on('stream-subscribed', (evt)=>{
            let stream = evt.stream;
            addVideoStream(stream.getId());
            stream.play(stream.getId());
        });
        client.on('stream-removed', removeVideoStream);
    },handleFail);

},handleFail);
