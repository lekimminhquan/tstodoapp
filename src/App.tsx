import React, { useRef, useState,useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios-typescript';
import { keyboardKey } from '@testing-library/user-event';
import { EventType } from '@testing-library/react';
import { tasks } from './models/task';


function App () {
  const [task,setTask] = useState<tasks[]>([])
  const [roles, setRole] = useState(0);
  const prerole = useRef(0)
  
  const del = () => {
    task.map(async (e) => {
      console.log(typeof e)
      if (e.check == true) {
        await axios
          .delete(
            "https://6641d7633d66a67b34352311.mockapi.io/api/todolist/1/" + e.id
          )
          .then((res) => {
            removeelement(e.id);
          })
          .catch((error) => {
            return 0;
          });
      }
      return 0;
    });
  };
  const removeelement = (id:string) => {
    for (let i = 0; i<task.length;i++) {
      if (task[i].id == id) { 
        task.splice(i, 1);
        setTask([...task]);
        del();
      }
    }
  };
  const getapitask = async () => {
    await axios
      .get("https://6641d7633d66a67b34352311.mockapi.io/api/todolist/1")
      .then((res) => {
        JSON.parse(res.data).map((e:tasks)=>{
          setTask((t)=>[...t,e])
        })
      });
    console.log(task)
  };
  const getapitasktodo = async () => {
    await axios
      .get("https://6641d7633d66a67b34352311.mockapi.io/api/todolist/1")
      .then((res) => {
        JSON.parse(res.data).map((e:tasks) => {
          if (e.status == "TO DO") {
            setTask((t)=>[...t,e]);
          }
        });
      });
  };
  const getapitaskinprogress = async () => {
    await axios
      .get("https://6641d7633d66a67b34352311.mockapi.io/api/todolist/1")
      .then((res) => {
        JSON.parse(res.data).map((e:tasks) => {
          if (e.status == "IN PROGRESS") {
            setTask((t) => [...t, e]);
            console.log(e.status);
          }
        });
      });
  };
  const getapitaskdone = async () => {
    await axios
      .get("https://6641d7633d66a67b34352311.mockapi.io/api/todolist/1")
      .then((res) => {
        JSON.parse(res.data).map((e:tasks) => {
          if (e.status == "DONE") {
            setTask((t) => [...t, e]);
          }
        });
      });
  };
  const postapi = async (e:React.ChangeEvent<HTMLInputElement>&React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (e.target.value != "") {
        await axios
          .post("https://6641d7633d66a67b34352311.mockapi.io/api/todolist/1", {
            item: e.target.value,
            status: "TO DO",
          })
          .catch((error) => {
            alert("bạn đã submit quá nhanh");
          });

        setTask([...task,{
            item: e.target.value,
            status: "TO DO",
            id: task.length != 0 ? task[task.length - 1].id + 1 : '1',
            check:false,
            key:false
          },]);
          e.target.value=""

      }
    }
  };
  const edit = (id:string) => {
    task.map((item) => {
      if (item.id == id) {
        item.key = true;
      }
      setTask([...task]);
    });
  };

  const editlisten = async (e:React.ChangeEvent<HTMLInputElement>& React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode == 13) {
      if (e.target.value != "") {
        axios.put(
          "https://6641d7633d66a67b34352311.mockapi.io/api/todolist/1/" +
          e.target.id,
          {
            item: e.target.value,
          }
        );
        task.map((item) => {
          if (item.id == e.target.id) {
            item.key = false;
            item.item = e.target.value;
          }
        });
        setTask([...task]);
      } else {
        task.map((item) => {
          if (item.id == e.target.id) {
            item.key = false;
          }
        });
        setTask([...task]);
      }
    }
  };



  const showseleterole = (statusname:string, value:string) => {
    if (statusname == value) {
      return true;
    } else {
      return false;
    }
  };
  const checkdel = (e:React.ChangeEvent<HTMLInputElement>) => {
    task.map((t) => {
      if (t.id == e.target.id) {
        if (t.check == false) {
          t.check = true;
          setTask([...task]);
        } else {
          t.check = false;
          setTask([...task]);
        }
      }
    });
  };
  const setrole = async (e:React.ChangeEvent<HTMLSelectElement>) => {
    await axios.put(
      "https://6641d7633d66a67b34352311.mockapi.io/api/todolist/1/" +
      e.target.id,
      {
        status: e.target.value,
      }
    );
    task.map((item) => {
      if (item.id == e.target.id) {
        item.status = e.target.value;
      }
    });
    setTask([...task]);
  };
  useEffect(() => {
    switch (roles) {
      case 0: {
        setTask([]);
        getapitask();
        prerole.current = roles;
        break;
      }
      case 1: {
        setTask([]);
        getapitasktodo();
        prerole.current = roles;
        break;
      }
      case 2: {
        setTask([]);
        getapitaskinprogress();
        prerole.current = roles;
        break;
      }
      case 3: {
        setTask([]);
        getapitaskdone();
        prerole.current = roles;
        break;
      }
    }
  }, [roles]);
  return (
    <div className="form">
      <div className="bodys">
        <p>NEED TO DO</p>
        <input
          type="text"
          placeholder="Add a new task and press 'Enter'"
          id="add"
          onKeyDown={postapi}
          
        />
        <div className="status">
          <span id="ALL" className={roles==0?'role':'unrol'} onClick={() => setRole(0)}>
            ALL
          </span>
          <span id="TO DO" className={roles==1?'role':'unrol'} onClick={() => setRole(1)}>
            To Do
          </span>
          <span id="IN PROGRESS" className={roles==2?"role":"unrol"} onClick={() => setRole(2)}>
            In Progressing
          </span>
          <span id="DONE" className={roles==3?"role":"unrol"} onClick={() => setRole(3)}>
            Done
          </span>
          <button className="clearbutton" onClick={del}>
            Clear
          </button>
        </div>
        <div className="items">
          <ul className="ul">
            {task.map((item, index) => {
              return (
                <li className="firstcome" id={item.id} key={index}>
                  <label>
                    <input
                      type="checkbox"
                      className="inputchecked"
                      id={item.id}
                      onChange={checkdel}
                      checked={item.check}
                    />
                    {item.key ? (
                      <input
                        className="add2"
                        onKeyDown={editlisten}
                        id={item.id}
                        defaultValue={item.item}
                      ></input>
                    ) : (
                      <p className="taskp" id={item.id}>
                        {item.item}
                      </p>
                    )}
                    <span
                      className="material-symbols-outlined"
                      onClick={() => edit(item.id)}
                    >
                      edit
                    </span>
                    <select
                      name="statustask"
                      className="roles"
                      id={item.id}
                      onChange={setrole}
                    >
                      <option
                        className="opt"
                        value="TO DO"
                        id={item.id}
                        selected={showseleterole(item.status, "TO DO")}

                      >
                        TO DO
                      </option>
                      <option
                        className="opt"
                        value="IN PROGRESS"
                        id={item.id}
                        selected={showseleterole(item.status, "IN PROGRESS")}
                      >
                        IN PROGRESS
                      </option>
                      <option
                        className="opt"
                        value="DONE"
                        id={item.id}
                        selected={showseleterole(item.status, "DONE")}
                      >
                        DONE
                      </option>
                    </select>
                  </label>
                  <p className="line"></p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

// comment

export default App;
