import { useEffect, useRef, useState } from "react";
import "./CameraCapture.css";

export default function CameraCapture({
    onCaptured,
    onClose,
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [preview, setPreview] = useState(null);
    const [previewType, setPreviewType] = useState("");

    const [recording, setRecording] = useState(false);
    const [mediaFile, setMediaFile] = useState(null);

    // "photo" | "video" — which mode is selected in the pill toggle
    const [mode, setMode] = useState("photo");

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);


    async function startCamera() {
        try {
            setLoading(true);
            setError("");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment",
                    },
                },
                audio: true,
            });


            streamRef.current = stream;


            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }


            setLoading(false);

        } catch (err) {

            console.error(err);

            setError("Unable to access camera.");

            setLoading(false);
        }
    }


    function stopCamera() {

        if (!streamRef.current) return;


        streamRef.current
            .getTracks()
            .forEach(track => track.stop());


        streamRef.current = null;
    }



    function capturePhoto() {

        if (!videoRef.current) return;


        const canvas = canvasRef.current;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;


        const context = canvas.getContext("2d");


        context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.toBlob((blob) => {

            const url = URL.createObjectURL(blob);

            setPreview(url);
            setPreviewType("image");
            setMediaFile(blob);


        }, "image/jpeg");


        stopCamera();
    }



    function startRecording() {

        if (!streamRef.current) return;


        chunksRef.current = [];


        const recorder = new MediaRecorder(
            streamRef.current,
            {
                mimeType: "video/webm"
            }
        );


        recorderRef.current = recorder;


        recorder.ondataavailable = (event) => {

            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }

        };


        recorder.onstop = () => {

            const blob = new Blob(
                chunksRef.current,
                {
                    type: "video/webm"
                }
            );


            const url = URL.createObjectURL(blob);


            setPreview(url);
            setPreviewType("video");
            setMediaFile(blob);

        };


        recorder.start();

        setRecording(true);

    }



    function stopRecording() {

        if (recorderRef.current) {

            recorderRef.current.stop();

            setRecording(false);

            stopCamera();

        }

    }



    function retake() {

        setPreview(null);
        setPreviewType("");

        startCamera();

    }

    function handleGallerySelect(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        const url = URL.createObjectURL(file);

        setPreview(url);
        setMediaFile(file);

        if (file.type.startsWith("image")) {
            setPreviewType("image");
        } else {
            setPreviewType("video");
        }

        stopCamera();
    }

    // Single shutter handler: behaves per current mode + recording state.
    function handleShutterClick() {
        if (mode === "photo") {
            if (!recording) {
                capturePhoto();
            }
            return;
        }

        // mode === "video"
        if (!recording) {
            startRecording();
        } else {
            stopRecording();
        }
    }



    return (
        <div className="camera-fullscreen">

            <button
                className="camera-close"
                onClick={onClose}
                aria-label="Close camera"
            >
                ✕
            </button>

            {loading && (
                <div className="camera-loading">
                    Opening Camera...
                </div>
            )}

            {error && (
                <div className="camera-error">
                    {error}
                </div>
            )}

            {!preview && (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-feed"
                    />

                    <div className="camera-bottom">

                        <div className="camera-mode">
                            <button
                                className={mode === "photo" ? "active" : ""}
                                onClick={() => {
                                    if (!recording) setMode("photo");
                                }}
                            >
                                Photo
                            </button>

                            <button
                                className={mode === "video" ? "active" : ""}
                                onClick={() => {
                                    if (!recording) setMode("video");
                                }}
                            >
                                Video
                            </button>
                        </div>

                        <div className="camera-controls-row">

                            <button
                                className="camera-gallery-btn"
                                onClick={() => fileInputRef.current?.click()}
                                aria-label="Upload from gallery"
                            >
                                🖼
                            </button>

                            <button
                                className={`camera-shutter ${recording ? "recording" : ""}`}
                                onClick={handleShutterClick}
                            >
                                <span />
                            </button>

                            <div className="camera-controls-spacer" />

                        </div>

                    </div>
                </>
            )}

            {preview && (
                <div className="camera-preview-screen">

                    {previewType === "image" ? (
                        <img
                            src={preview}
                            className="camera-preview"
                            alt=""
                        />
                    ) : (
                        <video
                            src={preview}
                            controls
                            className="camera-preview"
                        />
                    )}

                    <div className="camera-preview-actions">

                        <button
                            className="retake-btn"
                            onClick={retake}
                        >
                            Retake
                        </button>

                        <button
                            className="continue-btn"
                            onClick={() => {
                                if (mediaFile) {
                                    onCaptured(mediaFile, previewType);
                                }
                            }}
                        >
                            Continue
                        </button>

                    </div>

                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={handleGallerySelect}
            />

            <canvas
                ref={canvasRef}
                style={{ display: "none" }}
            />

        </div>
    );
}