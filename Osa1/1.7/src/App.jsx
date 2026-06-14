import { useState } from 'react'

const Statistics = (props) => {
  return (
    <div>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
      <p>all {props.all}</p>
      <p>average {props.average}</p>
      <p>positive {props.positive}</p>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(6)
  const [neutral, setNeutral] = useState(2)
  const [bad, setBad] = useState(1)

  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = (good / all) * 100 + ' %'

  return (
    <div>
      <h1>give feedback</h1>

      <button onClick={() => {
        setGood(good + 1)
      }
        }>
        good
      </button>

      <button onClick={() => {
        setNeutral(neutral + 1)
      }
        }>
        neutral
      </button>

      <button onClick={() => {
        setBad(bad + 1)
      }
        }>
        bad
      </button>

      <h1>Statistics</h1>

      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App