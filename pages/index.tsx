import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import ICAL from "ical.js";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileReady, setFileReady] = useState(false);
  const [fileContent, setFileContent] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Happy");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const prompt = "Write a personal journal entry without the exact dates and times of the week in a " + vibe + " manor where these events happend: " + bio
  
  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);


  };
  const dragOver = () => setDragging(true);
  const dragLeave = () => setDragging(false);


  let prevMonday = new Date();
  prevMonday.setDate(prevMonday.getDate() - 7);
  prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
  
  let prevSunday = new Date()
  prevSunday.setDate(prevSunday.getDate() - 7);
  prevSunday.setDate(prevSunday.getDate() + 1);

  function readURL(input: any) {
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
      reader.onload = function(e) {
        let jcalData = ICAL.parse(reader.result);
        let output = ''
        try {
          
        } catch(err) {
          output = 'invalid file format'
        }
        setBio(output)
        let series = jcalData[2].filter((item: any) => {
          if (item[0] != 'vevent') return false
          for(let i in item[1]) {
            if(item[1][i][0] == 'dtstart'){
              let eventStart = new Date(item[1][i][3])
              return eventStart.getTime() >= prevMonday.getTime() &&
              eventStart.getTime() <= prevSunday.getTime();
            }
          }
          return true
        });
        let text = ''
        console.log(series)
        series.forEach((element: Array<any>) => {
          let summary = '';
          let start = '';
          let location = '';
          for(let i in element[1]) {
            if(element[1][i][0] == 'summary'){
              summary = element[1][i][3]
            }
            if(element[1][i][0] == 'dtstart'){
              start = (new Date(element[1][i][3])).toLocaleString('en-US')
            }
            if(element[1][i][0] == 'location'){
              location = element[1][i][3]
            }
            // if you got location, add weather
            // add your mood (if you want)
            // add with whom you were at the event like "... at ... together with ..."
          }
          if(summary) {
            text += "\n"
            text += '- "' + summary + '"';
            if (start) text += ' around ' + start
            if (location) text += ' at ' + location
          }

        });
        setBio(text)
        setFileReady(true)
      };
  
      reader.readAsText(input.files[0]);

    }
  }

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Journal Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col shadow-2xl items-center justify-center text-center px-4 mt-12">
        
        <h1 className="mt-10 sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          Generate a journal entry of your week in seconds
        </h1>
        
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Upload your week from your calendar{" "}
            </p>
          </div>

          <Image
              src="/export-calendar.png"
              width={400}
              height={30}
              alt="1 icon"
              className="shadow-lg mt-5 m-auto"
            />

          <div className={(dragging ? 'image-dropping' : '') + ' image-upload-wrap'} onDragOver={dragOver} onDragLeave={dragLeave}>
            <input className="file-upload-input" type='file' 
            onChange={(e) => readURL(e.target)}
            accept="text/calendar" />
            <div className="drag-text">
              <h3>Drop or select a .ics file</h3>
            </div>
          </div>

          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select how you felt that week.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your journal entry &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedBios && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated entry
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    {generatedBios
                      .split(":::::::")
                      .map((generatedBio) => {
                        return (
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedBio);
                              toast("Entry copied to clipboard", {
                                icon: "✂️",
                              });
                            }}
                            key={generatedBio}
                          >
                            <p>{generatedBio}</p>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
