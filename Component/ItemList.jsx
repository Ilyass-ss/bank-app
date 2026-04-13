import { useState } from "react"

let languages = [
    'JavaScript',
    'Css',
    'Html',
    'Python'
]

function LanguagesList({toods}) {
    const [selected, setSelected] = useState(() =>  {let selectedLang = localStorage.getItem("selectedLang") || -1;
        return parseInt(selectedLang)
    });

    let handleSelected = (index) => {
        setSelected(index);
        localStorage.setItem("selectedLang", index)
    }

    // console.log(selected)

    return (
        <>
        <ul>
            {toods.map((tood, index) => 
            {return <li className={`listLang ${selected == index && 'selected'} ${tood.completed && 'true'}`} key={index} onClick={() => handleSelected(index)}>{String(tood.title )}</li>})}
        </ul>
        </>
    )
}

export default LanguagesList