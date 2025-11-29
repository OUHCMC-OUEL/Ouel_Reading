import React, { useState, useEffect, useRef } from 'react'
import './Quiz.css'
import { getPassageQuestions } from '../../services/api';

export default function Quiz({ passage }) {

  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [lock, setLock] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [suggestionOptions, setsuggestionOptions] = useState(['A', 'B', 'C', 'D']);
  const [suggestioned,setSuggestioned]= useState(false);


  const OptionA = useRef(null);
  const OptionB = useRef(null);
  const OptionC = useRef(null);
  const OptionD = useRef(null);

  const option_array = [OptionA, OptionB, OptionC, OptionD];
  const map = { A: 0, B: 1, C: 2, D: 3 };

  useEffect(() => {
    if (!passage?.id) return;
    const fetchQuestions = async () => {
      try {
        const data = await getPassageQuestions(passage.id);
        setQuestions(data);
        setQuestion(data[0]);
      } catch (error) {
        console.error('không thể fetch passage:', error);
      }
    };
    fetchQuestions();
  }, [passage?.id]);

  if (!questions || questions.length === 0) {
    return <div>Chưa có câu hỏi cho passage này.</div>;
  }


  const checkAns = (e, ans) => {
    if (lock) return;
    const correct = question.correct_answer;
    setUserAnswers(prev => ({
      ...prev,
      [index]: ans
    }));
    if (correct === ans) {
      e.target.classList.add("correct");
      setScore(prev => prev + 1);
    } else {
      e.target.classList.add("wrong");
      option_array[map[correct]].current.classList.add("correct");
    }
    setLock(true);
  };


  const resetOptions = () => {
    option_array.forEach(opt => {
      opt.current.classList.remove("wrong");
      opt.current.classList.remove("correct");
    });
  };

  const SavedAnswer = (qIndex) => {
    const saved = userAnswers[qIndex];
    if (!saved) {
      setLock(false);
      return;
    }
    const correct = questions[qIndex].correct_answer;
    option_array[map[saved]].current.classList.add(
      saved === correct ? "correct" : "wrong"
    );
    if (saved !== correct) {
      option_array[map[correct]].current.classList.add("correct");
    }
    setLock(true);
  };


  const next = () => {

    if (index === questions.length - 1) {
      setResult(true);
      return;
    }

    const newIndex = index + 1;
    setIndex(newIndex);
    setQuestion(questions[newIndex]);
    setsuggestionOptions(['A', 'B', 'C', 'D']);
    setSuggestioned(false);
    resetOptions();
    setTimeout(() => SavedAnswer(newIndex));
  };


  const prevn = () => {
    if (index === 0) return;

    const newIndex = index - 1;
    setIndex(newIndex);
    setQuestion(questions[newIndex]);
    setsuggestionOptions(['A', 'B', 'C', 'D']);
    setSuggestioned(false);
    resetOptions();
    setTimeout(() => SavedAnswer(newIndex));
  };

  const useFiftyFifty = () => {
    if (lock) return;
    if(suggestioned) return;
    const correct = question.correct_answer;
    const wrongOptions = ['A', 'B', 'C', 'D'].filter(opt => opt !== correct);
    const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    setsuggestionOptions([correct, randomWrong]);
    setSuggestioned(true);
  }


  const reset = () => {
    setsuggestionOptions(['A', 'B', 'C', 'D']);
    setIndex(0);
    setQuestion(questions[0]);
    setLock(false);
    setUserAnswers({});
    setScore(0);
    setResult(false);
    resetOptions();
  }

  return (
    <div className='container'>
      <h1>Quiz</h1>
      <hr />

      {result ? (
        <>
          <h2>Điểm : {score}/{questions.length}</h2>
          <button onClick={reset}>Làm bài khác</button>
        </>
      ) : (
        <>
          <h2>{index + 1}. {question.question_text}</h2>

          <ul>
            <li ref={OptionA} onClick={(e) => checkAns(e, "A")} className={!suggestionOptions.includes("A") ? "hidden" : ""}>{question.option_a}</li>
            <li ref={OptionB} onClick={(e) => checkAns(e, "B")} className={!suggestionOptions.includes("B") ? "hidden" : ""}>{question.option_b}</li>
            <li ref={OptionC} onClick={(e) => checkAns(e, "C")} className={!suggestionOptions.includes("C") ? "hidden" : ""}>{question.option_c}</li>
            <li ref={OptionD} onClick={(e) => checkAns(e, "D")} className={!suggestionOptions.includes("D") ? "hidden" : ""}>{question.option_d}</li>
          </ul>
          {lock ? (
            <div className="explanation">
              Giải thích: {question.explanation}
            </div>
          ) : (<button onClick={useFiftyFifty}>50/50</button>)}
          <button onClick={prevn}>Prev</button>
          <button onClick={next}>Next</button>
          <div className="index">{index + 1} / {questions.length} Câu hỏi</div>
        </>
      )}
    </div>
  );
}
