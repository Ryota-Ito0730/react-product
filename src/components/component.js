// 各画面のボタン
export function Button (
  {buttonText,buttonClass,buttonHundles,argKey,buttonDisabled,hundleAnimEnd=null,caractor=null}) {
  return (
    <>
      <button 
        disabled={buttonDisabled}
        key={argKey}
        className={buttonClass}
        onClick={buttonHundles}
        onAnimationEnd={hundleAnimEnd}
        value={caractor}
        type="button">{buttonText}
      </button>
    </>
  )
}

// 各画面の見出し的テキスト
export function HeadText ({headText, headTextClass}) {
  return <div className={headTextClass}>{headText}</div>
}