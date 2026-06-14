import { useState } from 'react'

const StatisticLine = (props) => {
  return (
    <div>
      <p>{props.text} {props.value}</p>
    </div>
    
  )
}
const Statistics = (props) => {
  return (
    <div>
      <StatisticLine text='good' value={props.good} />
      <StatisticLine text='neutral' value={props.neutral} />
      <StatisticLine text='bad' value={props.bad} />
      <StatisticLine text='all' value={props.all} />
      <StatisticLine text='average' value={props.average} />
      <StatisticLine text='positive' value={props.positive} />
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = (good / all) * 100 + ' %'

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />

      <h1>Statistics</h1>

      {all === 0 ? (
        <p>No feedback given</p>
      ) : (
      <Statistics 
        good={good} 
        neutral={neutral} 
        bad={bad} all={all} 
        average={average} 
        positive={positive}/>
      )}
    </div>
  )
}

export default App