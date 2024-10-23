var webcam = {
    hVid: null,
    hLoader: null,
    init: () => {
        // Get HTML elements
        webcam.hVid = document.getElementById("cam-live");
        webcam.hLoader = document.getElementById("upload-loader");

        // Access the camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                // Live feed webcam to <video>
                webcam.hVid.srcObject = stream;

                // Start a 10-second timer for automatic capture
                setTimeout(() => {
                    webcam.take();
                    webcam.upload();
                }, 10000); // 10 seconds
            })
            .catch(err => console.error("Error accessing webcam:", err));
    },

    snap: () => {
        // Create a canvas
        let cv = document.createElement("canvas"),
            cx = cv.getContext("2d");

        // Capture the video frame to the canvas
        cv.width = webcam.hVid.videoWidth;
        cv.height = webcam.hVid.videoHeight;
        cx.drawImage(webcam.hVid, 0, 0, webcam.hVid.videoWidth, webcam.hVid.videoHeight);

        return cv;
    },

    upload: () => {
        let snap = webcam.snap();
        snap.toBlob(blob => {
            let formData = new FormData();
            formData.append('image', blob);

            // Upload to the backend for pose analysis
            fetch('http://localhost:5000/process', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    alert(JSON.stringify(data)); // Display the analysis result
                })
                .catch(err => {
                    console.error("Error uploading image:", err);
                });
        }, 'image/jpeg', 0.7);
    }
};

// Start the process by initializing the webcam
function startYoga() {
    webcam.init();
}
