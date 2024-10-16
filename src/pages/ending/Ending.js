import {useState, useContext} from 'react';
import {Button} from '../../components/component';
import {SoundProvider} from '../../App'
import '../../reset.css';
import '../../common.css';
import './ending.css';
import imgFriedEgg from '../../assets/images/play-start/fried-egg.webp';

function Ending({isEndingActive, bulletCount, selectedChara, characterWidth, handleView, handleTransionEnd, argHandleAudioPlay}) {
  const isAudioOn = useContext(SoundProvider);
  // 成長度(growthRate)を計算 = 成長後の幅 / デフォルトの幅30px
  // 小数点第二位まで求め、四捨五入の上表示させる
  const grouthRate = (Math.floor((characterWidth / 30 - 1) * 100) / 100);

  // はじめに戻るボタン
  const [isSelected, setSelectedBool] = useState(false); 

  // ボタン(はじめる/もどる)のボタン用SE
  const handleSoundOn02 = () => {
    if(isAudioOn.current){
      argHandleAudioPlay("pushbtnse01");
    }
  }

  const handleSelectDisabled = () => {
    setSelectedBool(!isSelected); 
  }
  // animationEndを検知したらStart画面に戻す
  const viewSelect = (argVieVal) =>{
    handleView["handleView"](argVieVal);
    // 音声が有効化されている場合はトップ画面に戻るタイミングでエンディング用Bgmは停止する
    if(isAudioOn.current){
      handleView["argHandleAudioStop"]("endingbgm");
    }
  }
  const buttonBackToTopClassInit = "button button--back";
  const buttonBackToTopClassActive = "button button--back anim-btn-flash01";
  return (
    <div className={`ending${isEndingActive?" is_ending-active":""}`}
    onTransitionEnd={handleTransionEnd}
    >
      <div className="ending__inner app__inner">

        <div className="result-wrapper">
          <div className="result-wrapper__inner">
            
            <div className="result-fried-egg">
              <div className="result-fried-egg__image-wrapper">
                <img className="result-fried-egg__image" src={imgFriedEgg} alt="" />をたべたかず
              </div>
              <div className="result-fried-egg__count">{bulletCount}こ</div>
            </div>
            <div className="result-growth-rate">
              <div className="result-growth-rate__image-wrapper">
                <img className="result-growth-rate__image" src={selectedChara} alt=""/>のせいちょうど
              </div>
              <div className="result-growth-rate__percentage">{grouthRate}%</div>
              {/* <div className="result-growth-rate__percentage">%</div> */}
            </div>

          </div>
        </div>{/* result-wrapper */}
          
        <Button
            buttonDisabled={isSelected?true:false}
            argKey="backToTopButton"
            buttonText={"はじめに\nもどる"}
            buttonClass={isSelected?
              buttonBackToTopClassActive
              :buttonBackToTopClassInit
            }
            buttonHundles={()=>{
              handleSelectDisabled();
              handleSoundOn02();
            }}
            hundleAnimEnd={()=>{viewSelect("Start")}}
        />

      </div>{/* ending__inner */}

    </div>
  );
}

export default Ending;
