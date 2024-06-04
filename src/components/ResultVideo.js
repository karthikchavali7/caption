import { useEffect,useState,useRef} from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import {toBlobURL,fetchFile} from "@ffmpeg/util";
import { transcriptionItemsToSrt } from "@/libs/awsTranscriptionHelpers";
import roboto from './../fonts/Roboto-Regular.ttf'
import robotoBold from './../fonts/Roboto-Bold.ttf'
export default function ResultVideo({filename,transcriptionItems}) {
  const videoUrl = "https://karthik-epic-captions.s3.amazonaws.com/"+filename;
  const [loaded, setLoaded] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [progress, setProgress] = useState(1);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.src = videoUrl;
    load();
  }, []);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    await ffmpeg.writeFile('/tmp/roboto.ttf', await fetchFile(roboto));
    await ffmpeg.writeFile('/tmp/roboto-bold.ttf', await fetchFile(robotoBold));
    setLoaded(true);
  }

  function toFFmpegColor(rgb) {
    const bgr = rgb.slice(5,7) + rgb.slice(3,5) + rgb.slice(1,3);
    return '&H' + bgr + '&';
  }

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    const srt = transcriptionItemsToSrt(transcriptionItems);
    await ffmpeg.writeFile(filename, await fetchFile(videoUrl));
    await ffmpeg.writeFile('subs.srt', srt);
    videoRef.current.src = videoUrl;
    await new Promise((resolve, reject) => {
      videoRef.current.onloadedmetadata = resolve;
    });
    const duration = videoRef.current.duration;
    ffmpeg.on('log', ({ message }) => {
      const regexResult = /time=([0-9:.]+)/.exec(message);
      if (regexResult && regexResult?.[1]) {
        const howMuchIsDone = regexResult?.[1];
        const [hours,minutes,seconds] = howMuchIsDone.split(':');
        const doneTotalSeconds = hours * 3600 + minutes * 60 + seconds;
        const videoProgress = doneTotalSeconds / duration;
        setProgress(videoProgress);
      }
    });
    await ffmpeg.exec([
      '-i', filename,
      '-preset', 'ultrafast',
      '-vf', `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=30,MarginV=70,PrimaryColour=${toFFmpegColor(primaryColor)},OutlineColour=${toFFmpegColor(outlineColor)}'`,
      'output.mp4'
    ]);
    const data = await ffmpeg.readFile('output.mp4');
    videoRef.current.src =
      URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    setProgress(1);
  }
  return (
    <>
      <div className="mb-4">
        <button onClick={transcode} className="bg-green-400 py-2 px-4 rounded-full inline-flex gap-2 border-blue-500 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          <span>Generate captions</span>
        </button>
      </div>
      <div>
        Primary color:
        <input type="color" value={primaryColor} onChange={ev => setPrimaryColor(ev.target.value)} /><br />
        Outline color:
        <input type="color" value={outlineColor} onChange={ev => setOutlineColor(ev.target.value)} />
      </div>
      <div className="rounded-xl overflow-hidden relative h-fit w-fit">
        {progress && progress < 1 && (
          <div className="absolute inset-0 bg-black/80 flex items-center">
            <h3 className="text-white text-3xl w-full text-center">{parseInt(progress * 100)}%</h3>
          </div>
        )}
        <video data-video={0} ref={videoRef} className="w-80 h-auto" controls></video>
      </div>
    </>
  );
  
}
