import * as React from 'react';
import * as CONST from "../utils/const";
import {useEffect, useState} from "react";

export const About = () => {
  const [currentCountry, setCurrentCountry] = useState('japan')
  const [volume, setVolume] = useState('0.5')
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audio, setAudio] = useState()

  useEffect(()=>{
    const audioObj = new Audio(`/audio/${currentCountry}.mp3`);
    setAudio(audioObj)
  },[currentCountry])

  const changeCountry = (country: string) => {
    setCurrentCountry(country)
    audio.pause()
    setIsPlaying(false)
    setProgress(0)
  }

  const changeVolume = (volume: string) => {
    setVolume(volume)
    audio.volume = volume;
  }

  const togglePlay = () => {
    if(audio.paused){
      setIsPlaying(true)
      audio.volume = volume;
      audio.play()
      audio.addEventListener('timeupdate', ()=> {
        setProgress(audio.currentTime / audio.duration)
      })
      audio.addEventListener('ended', ()=>{
        setIsPlaying(false)
        setProgress(0)
      })
    } else {
      setIsPlaying(false)
      audio.pause()
    }
  }

  const setSentence = () => {
    let sentence;
    switch (currentCountry) {
      case 'japan':
        sentence = 'お疲れ様です、佐々木と申します。自己紹介しようとしようとしたんですけども、このサイト日本語で見てる人たぶんいないとおもうので、しません(笑)。もし今聞いて理解できる方いればご連絡お願い致します。失礼します。'
        break
      case 'poland':
        sentence = 'Cześć Jestem Kaziu, pochodzę z kraju kwitnącego sushi. Lubię tworzyć krótkie filmiki. Mam nadzieję, że rozumiecie mój polski. Uczyłem się z serialu trudne sprawy przy okazji poznając polską kulturę.Pozdrawiam.'
        break
      case 'uk':
        sentence = 'Hi, Im japanes man desu'
        break
      case 'spain':
        sentence = 'no hablo espanol, Lo siento!'
        break
      default:
        break;
    }
    return sentence;
  }

  return (
    <div className="about">
      <div className="container">
        <img src={`${CONST.PATH.IMG_ABOUT}kaziu.png`} width="250px" className={`logo ${isPlaying && 'active'}`}/>
        <div className="countries">
          <img
            src={`${CONST.PATH.IMG_ABOUT}japan.svg`}
            onClick={()=>changeCountry('japan')}
            className={currentCountry === 'japan' && 'active'}
          />
          <img
            src={`${CONST.PATH.IMG_ABOUT}poland.svg`}
            onClick={()=>changeCountry('poland')}
            className={currentCountry === 'poland' && 'active'}
          />
          <img
            src={`${CONST.PATH.IMG_ABOUT}uk.svg`}
            onClick={()=>changeCountry('uk')}
            className={currentCountry === 'uk' && 'active'}
          />
          <img
            src={`${CONST.PATH.IMG_ABOUT}spain.svg`}
            onClick={()=>changeCountry('spain')}
            className={currentCountry === 'spain' && 'active'}
          />
        </div>
        <div className="display">
          <div className="control">
            <img
              className="play"
              src={`${CONST.PATH.IMG_ABOUT}${isPlaying ? 'pause.svg' : 'play.svg'}`}
              onClick={()=>togglePlay()}
            />
            <div className="bars">
              <input
                type="range"
                min="0"
                max="1"
                step=".01"
                value={volume}
                onChange={(e)=>changeVolume(e.target.value)}
              />
              <progress value={progress}/>
            </div>
          </div>
        </div>
      </div>
      <div className="sentence">
        {setSentence()}
      </div>
    </div>
  );
}