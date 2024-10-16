import '../../reset.css';
import '../../common.css';
import './play-end.css';

function PlayEnd({isActive,isEndingActive}) {
  let addClass = "";
  if(isActive){
    addClass = " is_active";
  }
  if(isEndingActive) {
    addClass = " is_active is_ending-active";
  }
  return (
    <div className={`play-end${addClass}`}>
      <div className="play-end__inner">

        <div className="play-end-text-wrapper">
          <div className="play-end-text">おしまい！</div>
        </div>

      </div>{/* play-end__inner */}
    </div>
  );
}

export default PlayEnd;
