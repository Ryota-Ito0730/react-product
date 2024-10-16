import {useState,useEffect,useContext} from 'react';
import {Button} from '../../components/component';
import {HeadText} from '../../components/component';
import {SoundProvider} from '../../App'
import '../../reset.css';
import '../../common.css';
import './start.css';

function Start({handleView,argHandleIsAudioRef,argHandleAudioPlay,argHandleAudioStop}) {
  const isAudioOn = useContext(SoundProvider);
  useEffect(()=>{
    if(isAudioOn.current){
      // 音ありでステージセレクトから戻るを押下後に再生させる
      argHandleAudioPlay("topbgm");
    }    
  },[argHandleAudioPlay, isAudioOn]);// useEffect  
  
  // おん ボタンにセット中の関数(buttonOnHundles)
  const handleSoundOn01 = () => {
    argHandleAudioPlay("topbgm");
    argHandleAudioPlay("pushbtnse01");
  }

  // おふボタンにセット中の関数(buttonOffHundles)
  const handleSoundOff = () => {
    argHandleAudioStop("topbgm");
  }

  // サウンド おん おふボタンのフラッシュアニメーション
  const [isOnBtnActive, setOnBtnBool] = useState(false); 
  const [isOffBtnActive, setOffBtnBool] = useState(false); 
  const [isSelected, setSelectedBool] = useState(false); 
  const [rendorCount, setRendorCount] = useState(0); 
  const handleOnClick = () => {
    setOnBtnBool(!isOnBtnActive); 
  }
  const handleOffClick = () => {
    setOffBtnBool(!isOffBtnActive); 
  }
  const handleRendorCount = () => {
    setRendorCount(rendorCount => rendorCount + 1); 
  }
  const handleSelectDisabled = () => {
    setSelectedBool(!isSelected); 
  }
  // 1つの関数に集約してコンポーネント内にセット
  // おんボタン
  const buttonOnHundles = (e) => {
    handleOnClick();
    handleRendorCount();
    argHandleIsAudioRef(true);
    handleSoundOn01();
  }
  // おふボタン
  const buttonOffHundles = (e) => {
    handleOffClick();
    handleRendorCount();
    argHandleIsAudioRef(false); 
    handleSoundOff();   
  }
  // 1度選んだら次の画面に進むまで押されないボタン用
  // はじめる ボタンにセット中の関数
  const buttonSelect = (e) => {
    handleSelectDisabled();
    if(isAudioOn.current) {
      argHandleAudioPlay("pushbtnse01");
    }
  }
  // animationEndを検知したらStageSelect画面に移動
  const viewSelect = (e) => {
    handleView("StageSelect");
    if(isAudioOn.current) {
      // はじめるボタンのアニメーションエンドのタイミングでTOPBGMは停止する
      argHandleAudioStop("topbgm");
    }
  }
  const buttonOnClassInit = "button button--Sound-on";
  const buttonOnClassActive = "button button--Sound-on";
  const buttonOffClassInit = "button button--Sound-off";
  const buttonOffClassActive = "button button--Sound-off";
  const buttonSelectClassInit = "button button--start";
  const buttonSelectClassActive = "button button--start anim-btn-flash01";
  const selectedColor = " button-selected-color";
  return (
    <div className="start">
      <div className="start__inner app__inner">
        <HeadText headText={"おとしだま\nかせぎ"} headTextClass={"head-text"} />
        <div className="Sound-switch-wrapper">
          <div className="Sound-switch-text">さうんど</div>
          <div className="start-button-wrapper">
              <Button 
                buttonDisabled={isAudioOn.current?true:false}
                argKey="onButton"
                buttonText={"おん"} 
                buttonClass={isAudioOn.current
                  ?buttonOnClassActive +`${rendorCount<1 ? selectedColor:" anim-btn-flash01"}`
                  :buttonOnClassInit
                }
                buttonHundles={buttonOnHundles}
                id={"audio01_play"}
              />
              <Button
                buttonDisabled={!isAudioOn.current?true:false}
                argKey="offButton"
                buttonText={"おふ"}
                buttonClass={!isAudioOn.current?
                  buttonOffClassActive +`${rendorCount<1 ? selectedColor:" anim-btn-flash01"}`
                  :buttonOffClassInit
                }
                buttonHundles={buttonOffHundles}
              />
          </div>
        </div>{/* Sound-switch-wrapper */}
        <Button
          buttonDisabled={isSelected?true:false}
          argKey="startButton"
          buttonText={"はじめる"}
          buttonClass={isSelected
            ?buttonSelectClassActive
            :buttonSelectClassInit
          }
          buttonHundles={buttonSelect}
          hundleAnimEnd={viewSelect}
        />
      </div>{/* start__inner */}
    </div>
  );
}

export default Start;
