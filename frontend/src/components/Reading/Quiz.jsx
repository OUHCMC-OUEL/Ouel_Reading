import React, { useState, useEffect, use } from 'react'
import './Quiz.css'
import { getPassageQuestions } from '../../services/api';

export default function Quiz({ passage }) {

  let [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  let [lock, setLock] = useState(true);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!passage?.id) return;
    const fetchQuestions = async () => {
      try {
        const data = await getPassageQuestions(passage.id);
        setQuestions(data);
      } catch (error) {
        console.error('không thể fetch passage:', error);
      }
    };
    fetchQuestions();
  }, [passage?.id]);
  if (!questions || questions.length === 0) {
    return <div>Chưa có câu hỏi cho passage này.</div>;
  }
  const question=questions[index]
  const next = () => {
    if (index<=questions.length) {
      setIndex(++index);
      // setLock(false);
    }
    question = questions[index];
  }
  const prev = () => {
    if (index>0) {
      setIndex(--index);
      // setLock(false);
    }
    question = questions[index];
  }

  const checkAns=(e,ans)=>{
    if(question.correct_answer===ans){
      e.tar
    }
  }

  return (
    <div className='container'>
      <h1>Quiz</h1>
      <hr />
      <h2>{index + 1}. {question.question_text}</h2>
      <ul>
        <li>{question.option_a}</li>
        <li>{question.option_b}</li>
        <li>{question.option_c}</li>
        <li>{question.option_d}</li>
      </ul>
      <button onClick={prev}>Prev</button>
      <button onClick={next}>Next</button>
      <div className="index">{index + 1} of {questions.length} Câu hỏi</div>
    </div>
  )
}
