import {useState,useContext,useEffect} from 'react';
import {Button} from '../../components/component';
import {HeadText} from '../../components/component';
import {SoundProvider} from '../../App'
import '../../reset.css';
import '../../common.css';
import './stage-select.css';

function StageSelect({handleView,handleSelectCharacter,argHandleAudioPlay,argHandleAudioStop}) {
  const isAudioOn = useContext(SoundProvider);
  useEffect(()=>{
    if(isAudioOn.current){
      argHandleAudioPlay("stageselectbgm");
    }
  },[argHandleAudioPlay,isAudioOn]);// useEffect

  const [isSelected, setSelectedBool] = useState(false); 
  const [activeIndex, setActiveIndex] = useState("");

  const handleBtnDisabled = (argVal) => {
    setActiveIndex(argVal);// 選択されたキャラのみレンダーされるように差別化する
  }
  // ボタン(はじめる/もどる)のボタン用SE
  const handleSoundOn02 = () => {
    if(isAudioOn.current){
      argHandleAudioPlay("pushbtnse01");
    }
  }
  const handleCharaSelect = () => {
    if(isAudioOn.current){
      argHandleAudioPlay("charaselectse");
    }
  }
  const handleSelectDisabled = () => {
    setSelectedBool(!isSelected); 
  }
  // animationEndを検知したらStart画面に戻す
  const viewSelect = (argVieVal) =>{
    handleView(argVieVal);
    if(isAudioOn.current) {
      argHandleAudioStop("stageselectbgm");
    }
  }
  const buttonBackToTopClassInit = "button button--back";
  const buttonBackToTopClassActive = "button button--back anim-btn-flash01";
  const stageSelectClassInit = "button stage-select__button";
  const stageSelectClassActive = "button stage-select__button anim-btn-flash02";
  return (
    <div className="stage-select">
      
      <div className="stage-select__inner app__inner">

        <HeadText headText={"ステージを\nえらんでね"} headTextClass={"head-text"} />
        
        <div className="stage-select__button-wrapper">
          <Button
          buttonHundles={()=>{
            handleBtnDisabled(0);
            handleSelectDisabled();
            handleCharaSelect();
          }}
          buttonDisabled={isSelected?true:false}
          buttonClass={activeIndex === 0
            ?stageSelectClassActive +" stage-select__button--cat"
            :stageSelectClassInit +" stage-select__button--cat"
          }
          hundleAnimEnd={()=>{
            viewSelect("PlayStart");
            handleSelectCharacter("cat");
          }}/> 
          <Button 
          buttonHundles={()=>{
            handleBtnDisabled(1);
            handleSelectDisabled();
            handleCharaSelect();
          }}
          buttonDisabled={isSelected?true:false}
          buttonClass={activeIndex === 1
            ?stageSelectClassActive +" stage-select__button--polar-bear"
            :stageSelectClassInit +" stage-select__button--polar-bear"
          }
          hundleAnimEnd={()=>{
            viewSelect("PlayStart")
            handleSelectCharacter("polar-bear");
          }}/>
          <Button
          buttonHundles={()=>{
            handleBtnDisabled(2);
            handleSelectDisabled();
            handleCharaSelect();
          }}
          buttonDisabled={isSelected?true:false}
          buttonClass={activeIndex === 2
            ?stageSelectClassActive +" stage-select__button--dog"
            :stageSelectClassInit +" stage-select__button--dog"
          }
          hundleAnimEnd={()=>{
            viewSelect("PlayStart")
            handleSelectCharacter("dog");
          }}/> 
          <Button
          buttonHundles={()=>{
            handleBtnDisabled(3);
            handleSelectDisabled();
            handleCharaSelect();
          }}
          buttonDisabled={isSelected?true:false}
          buttonClass={activeIndex === 3
            ?stageSelectClassActive +" stage-select__button--axolot"
            :stageSelectClassInit +" stage-select__button--axolot"
          }
          hundleAnimEnd={()=>{
            viewSelect("PlayStart")
            handleSelectCharacter("axolot");
          }}/> 
        </div>
        <Button
            buttonDisabled={isSelected?true:false}
            argKey="backToTopButton"
            buttonText={"はじめに\nもどる"}
            buttonClass={activeIndex === 4
              ?buttonBackToTopClassActive
              :buttonBackToTopClassInit
            }
            buttonHundles={()=>{
              handleBtnDisabled(4);
              handleSelectDisabled();
              handleSoundOn02();
            }}
            hundleAnimEnd={()=>{viewSelect("Start")}}
        />
        
      </div>{/* stage-select__inner */}

    </div>
  );
}

export default StageSelect;
