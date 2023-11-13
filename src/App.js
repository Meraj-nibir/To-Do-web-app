import React,{ useEffect, useState } from 'react';
import {AiOutlineDelete} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';
import {BiRightArrow} from 'react-icons/bi';
import './App.css';

function App() {
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setnewTitle] = useState("");
  const [newDescrip, setnewDescrip] = useState("");
  const [isCompleteScreen, setIsCompleteScreen] = useState(0);
  const [completedTodos,setCompletedTodos] = useState([]);
  const [startedTodos,setStartedTodos] = useState([]);
  const isListTabActive = () => isCompleteScreen === 0
  const isInProgressTabActive = () => isCompleteScreen === 1;
  const isCompletedTabActive = () => isCompleteScreen === 2;

  const changeTab = (index) =>{
    setIsCompleteScreen(index);
  };

  const handleAddTodo = ()=>{
    let newTodoItem = {
      title:newTitle,
      description:newDescrip
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist',JSON.stringify(updatedTodoArr));
    setnewDescrip('');
    setnewTitle('');
  };

  const DeleteTodo = (index)=>{
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  }

  const completeDeleteTodo = (index)=>{
    let reducedCompleteTodo = [...completedTodos];
    reducedCompleteTodo.splice(index, 1);

    localStorage.setItem('completedTodos', JSON.stringify(reducedCompleteTodo));
    setCompletedTodos(reducedCompleteTodo);
  }

  const handelComplete = index =>{
    const date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth();
    var yy = date.getYear();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var completedOn = dd + '-' + mm + '-' + yy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);

    let reducedStartedArr = [...startedTodos];
    reducedStartedArr.splice(index, 1);
    setStartedTodos(reducedStartedArr);
  }

  const startTodo = index =>{
    const date = new Date();
    var sdd = date.getDate();
    var smm = date.getMonth();
    var syy = date.getYear();
    var sh = date.getHours();
    var sm = date.getMinutes();
    var ss = date.getSeconds();
    var startedOn = sdd + '-' + smm + '-' + syy + ' at ' + sh + ':' + sm + ':' + ss;

    let filteredItem = {
      ...allTodos[index],
      startedOn: startedOn,
    };

    let updatedStartedArr = [...startedTodos, filteredItem];
    setStartedTodos(updatedStartedArr);

    let updatedAllTodos = [...allTodos];
    updatedAllTodos.splice(index, 1);
    setTodos(updatedAllTodos);
    localStorage.setItem('todolist', JSON.stringify(updatedAllTodos));
  }

  useEffect(() => {
    let savedTodo = localStorage.getItem('todolist');
    console.log('Saved Todo:', savedTodo);
  
    try {
      savedTodo = JSON.parse(savedTodo);
      if (savedTodo) {
        setTodos(savedTodo);
        setStartedTodos(savedTodo.filter(item => item.startedOn));
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }, []);

  return (
    <div className="todo_App">
      <h1>To-Do</h1>

      <div className="todo_Wrapper">
        <div className="todo_input">
          <div className="todo_input_item">
            <label>Title:</label>
            <input type="text" 
              value={newTitle} 
              onChange={e => setnewTitle(e.target.value)} 
              placeholder="Write title of your task."/>
          </div>

          <div className="todo_input_item">
            <label>Description:</label>
            <input type="text"
             value={newDescrip} 
             onChange={e => setnewDescrip(e.target.value)} 
             placeholder="Write description of your task."/>
          </div>

          <div className="todo_input_item">
            <button 
              className='primaryBtn'
              type='button' 
              onClick={()=> handleAddTodo()} 
            >
              Add
            </button>
          </div>
        </div>

        <div className="tab_btn">
          <button 
            className={`tab_btn_item ${isCompleteScreen===0 && 'active'}`} 
            onClick={()=>changeTab(0)}
          >
            To-Do List
          </button>
          <button
            className={`tab_btn_item ${isCompleteScreen===1 && 'active'}`} 
            onClick={()=>changeTab(1)}
          >
            In progress
          </button>
          <button 
            className={`tab_btn_item ${isCompleteScreen===2 && 'active'}`} 
            onClick={()=>changeTab(2)}
          >
            Completed
          </button>
        </div>

        <div className="todo_list">
          {isListTabActive() && allTodos.map((item,index) =>{
            return(
              <div className= "todo_list_item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                  <div>
                  <AiOutlineDelete 
                    title='Delete'
                    className='icon' onClick={()=>DeleteTodo(index)}/>

                  <BiRightArrow 
                     title='Start'
                    className='arrow-icon' onClick={()=>startTodo(index)}/>
                </div>
              </div>
            )
          })}

          {isInProgressTabActive() && startedTodos.map((item,index) =>{
            return(
              <div className= "todo_list_item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small> Started on: {item.startedOn}</small></p>
                </div>
                
                <BsCheckLg title='Done' className='check-icon' onClick={() =>handelComplete(index) } />
              </div>
            )
          })}

          {isCompletedTabActive() && completedTodos.map((item, index) => {
            return (
              <div className="todo_list_item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small> Completed on: {item.completedOn}</small></p>
                </div>
                <AiOutlineDelete
                  title='Delete'
                  className='icon' onClick={() => completeDeleteTodo(index)} />
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default App;
