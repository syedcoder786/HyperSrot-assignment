import { useState } from "react";
import {
  Select,
  TextInput,
  Datepicker,
  Button,
  Dropdown,
  Modal,
  Label,
  Textarea,
  Toast,
  Popover,
} from "flowbite-react";
import { HiExclamation, HiOutlineExclamationCircle } from "react-icons/hi";
const Main = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editTask, setEditTask] = useState("");
  const [deleteTask, setDeleteTask] = useState("");
  const [taskData, setTaskData] = useState({
    id: 1,
    title: "",
    description: "",
    team: "",
    assignees: "",
    priority: "",
    status: "Pending",
  });

  const { id, title, description, team, assignees, priority, status } =
    taskData;

  const [gTasks, setGTasks] = useState(
    JSON.parse(localStorage.getItem("tasks"))
  );
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("tasks")));

  const [errmsg, setErrmsg] = useState("");

  const [filterTask, setFilterTask] = useState({
    fAssignees: "",
    fPriority: "Priority",
    fStartDate: "",
    fEndDate: "",
  });

  const { fAssignees, fPriority, fStartDate, fEndDate } = filterTask;

  const [sortName, setSortName] = useState("");

  const onTaskChange = (e) => {
    setTaskData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onTaskSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !team || !assignees || !priority) {
      return setErrmsg("Please enter all fields");
    }

    if (priority === "Priority") {
      return setErrmsg("Select priority");
    }

    if (title.length < 3) {
      return setErrmsg("Title must contain atleast 3 characters");
    }

    if (description.length < 6) {
      return setErrmsg("Description must contain atleast 6 characters");
    }

    if (team.length < 3) {
      return setErrmsg("Team must contain atleast 3 characters");
    }

    if (assignees.length < 3) {
      return setErrmsg("Assignees must contain atleast 3 characters");
    }

    // if (password.length < 6) {
    //   return setErrmsg("Password must contain atleast 6 characters");
    // }

    setErrmsg("");

    console.log(gTasks);

    const taskData = {
      id: gTasks?.length ? gTasks[gTasks.length - 1].id + 1 : 1,
      name: `Task ${gTasks?.length ? gTasks[gTasks.length - 1].id + 1 : 1}`,
      title,
      description,
      team,
      assignees,
      priority,
      start_date: new Date().toLocaleDateString(),
      end_date: "",
      status: "Pending",
    };

    console.log(taskData);
    if (tasks && gTasks) {
      setGTasks((prev) => [...prev, taskData]);
      setTasks((prev) => [...prev, taskData]);
      localStorage.setItem("tasks", JSON.stringify([...tasks, taskData]));
    } else {
      setGTasks([taskData]);
      setTasks([taskData]);
      localStorage.setItem("tasks", JSON.stringify([taskData]));
    }

    setSortName("Sort By");
    setOpenModal(false);
  };

  const onEditTaskSubmit = (e) => {
    e.preventDefault();

    setErrmsg("");

    let gTemp = gTasks?.map((obj) => {
      if (obj.id === editTask.id) {
        if (taskData.status === "Completed") {
          return {
            ...editTask,
            priority: taskData.priority,
            status: taskData.status,
            end_date: new Date().toLocaleDateString(),
          };
        }
        return {
          ...editTask,
          priority: taskData.priority,
          status: taskData.status,
          end_date: "",
        };
      }

      if (taskData.status !== "Completed") {
        let newObj = { ...obj, end_date: "" };
        return newObj;
      }
      return obj;
    });

    let temp = tasks?.map((obj) => {
      if (obj.id === editTask.id) {
        return {
          ...editTask,
          priority: taskData.priority,
          status: taskData.status,
        };
      }

      return obj;
    });

    setGTasks(gTemp);
    setTasks(temp);
    localStorage.setItem("tasks", JSON.stringify(gTemp));
    setSortName("Sort By");
    setOpenEditModal(false);
  };

  const onDeleteTask = (id) => {
    let gTemp = gTasks.filter((obj) => obj.id !== id);
    let temp = tasks.filter((obj) => obj.id !== id);

    setGTasks(gTemp);
    console.log(temp);
    setTasks(temp);
    localStorage.setItem("tasks", JSON.stringify(gTemp));
  };

  const filterTasks = (filterObj) => {
    // e.preventDefault();
    let assigneesKeyword = filterObj.fAssignees.toLowerCase();
    let priorityKeyword = filterObj.fPriority.toLowerCase();
    let sDateKeyword = filterObj.fStartDate;
    let eDateKeyword = filterObj.fEndDate;
    console.log(sDateKeyword);
    console.log(eDateKeyword);
    let temp = gTasks.filter((obj) => {
      return (
        obj.assignees.toLowerCase().startsWith(assigneesKeyword) &&
        (obj.priority.toLowerCase().startsWith(priorityKeyword) ||
          priorityKeyword === "priority") &&
        (!sDateKeyword || obj.start_date <= sDateKeyword) &&
        (!eDateKeyword || obj.end_date >= eDateKeyword)
      );
    });

    setTasks(temp);
  };

  const sortBy = (val) => {
    let temp;
    if (val === "Priority") {
      temp = tasks.sort((a, b) => {
        return Number(a.priority.slice(-1)) - Number(b.priority.slice(-1));
      });
    }

    if (val === "Start Date") {
      temp = tasks.sort((a, b) => {
        return a.start_date - b.start_date;
      });
    }

    if (val === "End Date") {
      temp = tasks.sort((a, b) => {
        return a.end_date - b.end_date;
      });
    }

    setTasks([...temp]);
  };

  return (
    <div className="w-11/12 mx-auto border-2 p-8">
      <div className="md:flex justify-between items-center">
        <div className="md:flex items-center gap-4">
          <h1>Filter By:</h1>
          {/* <FloatingLabel variant="outlined" label="Label" /> */}
          <TextInput
            placeholder="Assignee Name"
            id="base"
            type="text"
            sizing="sm"
            value={fAssignees}
            onChange={(e) => {
              setFilterTask({ ...filterTask, fAssignees: e.target.value });
              filterTasks({ ...filterTask, fAssignees: e.target.value });
            }}
          />

          <Select
            sizing="sm"
            onChange={(e) => {
              setFilterTask({ ...filterTask, fPriority: e.target.value });
              filterTasks({ ...filterTask, fPriority: e.target.value });
            }}
          >
            <option>Priority</option>
            <option>P0</option>
            <option>P1</option>
            <option>P2</option>
          </Select>

          <Datepicker
            sizing="sm"
            value={fStartDate}
            placeholder="Start Date"
            onSelectedDateChanged={(date) => {
              const d = new Date(date).toLocaleDateString();
              console.log(d);
              setFilterTask({ ...filterTask, fStartDate: d });
              filterTasks({ ...filterTask, fStartDate: d });
            }}
          />
          <Popover
            content={<p className="text-sm p-2">Clear Start Date</p>}
            trigger="hover"
          >
            <Button
              onClick={() => {
                setFilterTask({ ...filterTask, fStartDate: "" });
                filterTasks({ ...filterTask, fStartDate: "" });
              }}
              size="xs"
              color="failure"
              className="-ml-12"
            >
              X
            </Button>
          </Popover>

          <Datepicker
            sizing="sm"
            placeholder="End Date"
            value={fEndDate}
            onSelectedDateChanged={(date) => {
              const d = new Date(date).toLocaleDateString();
              console.log(d);
              setFilterTask({ ...filterTask, fEndDate: d });
              filterTasks({ ...filterTask, fEndDate: d });
            }}
          />

          <Popover
            content={<p className="text-sm p-2">Clear End Date</p>}
            trigger="hover"
          >
            <Button
              onClick={() => {
                setFilterTask({ ...filterTask, fEndDate: "" });
                filterTasks({ ...filterTask, fEndDate: "" });
              }}
              size="xs"
              color="failure"
              className="-ml-12"
            >
              X
            </Button>
          </Popover>
        </div>
        <div>
          <button
            onClick={() => setOpenModal(true)}
            className="px-8 py-1 bg-blue-800 hover:bg-blue-900 text-white"
          >
            Add New Task
          </button>

          <Modal
            show={openModal}
            size="md"
            popup
            onClose={() => setOpenModal(false)}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Create A Task
                </h3>

                {errmsg && (
                  <Toast>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                      <HiExclamation className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{errmsg}</div>
                    <Toast.Toggle onDismiss={() => setErrmsg("")} />
                  </Toast>
                )}

                <TextInput
                  placeholder="Title"
                  name="title"
                  type="text"
                  sizing="sm"
                  onChange={onTaskChange}
                />
                <Textarea
                  name="description"
                  placeholder="Description"
                  required
                  rows={4}
                  onChange={onTaskChange}
                />
                <TextInput
                  placeholder="Team"
                  name="team"
                  type="text"
                  sizing="sm"
                  onChange={onTaskChange}
                />
                <TextInput
                  placeholder="Assignees"
                  name="assignees"
                  type="text"
                  sizing="sm"
                  onChange={onTaskChange}
                />
                <Select
                  className="w-24"
                  name="priority"
                  sizing="sm"
                  onChange={onTaskChange}
                >
                  <option>Priority</option>
                  <option>P0</option>
                  <option>P1</option>
                  <option>P2</option>
                </Select>

                <div className="w-full">
                  <Button onClick={onTaskSubmit}>Create A Task</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>

      <div className="flex items-center gap-5 my-3">
        <h1>Sort By:</h1>
        <Select
          value={sortName}
          onChange={(e) => {
            setSortName(e.target.value);
            sortBy(e.target.value);
          }}
          sizing="sm"
        >
          <option>Sort By</option>
          <option>Priority</option>
          <option>Start Date</option>
          <option>End Date</option>
        </Select>
      </div>

      <Modal
        show={openEditModal}
        size="md"
        popup
        onClose={() => {
          setOpenEditModal(false);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit Task
            </h3>

            {errmsg && (
              <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                  <HiExclamation className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{errmsg}</div>
                <Toast.Toggle
                  onDismiss={() => {
                    setErrmsg("");
                  }}
                />
              </Toast>
            )}
            <form className="flex max-w-md flex-col gap-2">
              <Label value="Title" />
              <TextInput
                placeholder="Title:"
                name="title"
                type="text"
                sizing="sm"
                disabled
                className="rounded-lg bg-blue-200"
                value={editTask?.title}
                onChange={onTaskChange}
              />
              <Label value="Description:" />
              <Textarea
                name="description"
                placeholder="Description"
                required
                rows={4}
                disabled
                className="rounded-lg bg-blue-200"
                value={editTask?.description}
                onChange={onTaskChange}
              />
              <Label value="Team:" />
              <TextInput
                placeholder="Team"
                name="team"
                type="text"
                sizing="sm"
                disabled
                className="rounded-lg bg-blue-200"
                value={editTask?.team}
                onChange={onTaskChange}
              />
              <Label value="Assignees:" />
              <TextInput
                placeholder="Assignees"
                name="assignees"
                type="text"
                sizing="sm"
                disabled
                className="rounded-lg bg-blue-200"
                value={editTask?.assignees}
                onChange={onTaskChange}
              />

              <hr className="my-1" />

              <div className="flex gap-4 items-center">
                <Label value="Priority:" />
                <Select
                  className="w-24"
                  name="priority"
                  sizing="sm"
                  value={taskData?.priority}
                  onChange={onTaskChange}
                >
                  <option>P0</option>
                  <option>P1</option>
                  <option>P2</option>
                </Select>
                <Label value="Status:" />
                <Select
                  className="w-32"
                  name="status"
                  sizing="sm"
                  value={taskData?.status}
                  onChange={onTaskChange}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Deployed</option>
                  <option>Deffered</option>
                </Select>
              </div>

              <div className="w-full flex gap-2 my-2">
                <Button onClick={onEditTaskSubmit}>Edit Task</Button>
                <Button
                  onClick={() => {
                    setTaskData({
                      ...taskData,
                      priority: "P0",
                      status: "Pending",
                    });
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  onDeleteTask(deleteTask);
                  setOpenDeleteModal(false);
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className="md:flex justify-center gap-4">
        <div className="md:w-3/12 h-fit border-2 rounded-lg">
          <div className=" flex justify-center py-2 bg-gray-500 rounded-t-lg text-white">
            Pending
          </div>
          {tasks?.map((oneTask, index) => {
            if (oneTask.status === "Pending") {
              return (
                <div key={index}>
                  <div className="bg-gray-100 p-3 m-2 rounded">
                    <div className="flex items-center justify-between my-3">
                      <h1>{oneTask.name}</h1>
                      <button className="bg-blue-800 text-white px-2">
                        {oneTask.priority}
                      </button>
                    </div>
                    <hr />
                    <div>
                      <p className="text-xs">{oneTask.description}</p>
                    </div>

                    <div className="flex justify-between items-center my-2 px-1">
                      <h1>@{oneTask.assignees}</h1>
                      <Dropdown
                        dismissOnClick={true}
                        arrowIcon={false}
                        inline
                        label={
                          <div className="bg-blue-800 hover:bg-blue-900 px-2 pb-3 text-xl rotate-90 text-white">
                            ...
                          </div>
                        }
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setEditTask(oneTask);
                            setTaskData({
                              ...taskData,
                              priority: oneTask.priority,
                              status: oneTask.status,
                            });
                            setOpenEditModal(true);
                          }}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteTask(oneTask.id);
                          }}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown>
                    </div>

                    <button className="px-8 py-1 rounded bg-blue-800 hover:bg-blue-900 text-white">
                      Assign
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>

        <div className="md:w-3/12 h-fit border-2  rounded-lg">
          <div className="flex justify-center py-2 bg-yellow-500 rounded-t-lg text-white">
            In Progress
          </div>

          {tasks?.map((oneTask, index) => {
            if (oneTask.status === "In Progress") {
              return (
                <div key={index}>
                  <div className="bg-gray-100 p-3 m-2 rounded">
                    <div className="flex items-center justify-between my-3">
                      <h1>{oneTask.name}</h1>
                      <button className="bg-blue-800 text-white px-2">
                        {oneTask.priority}
                      </button>
                    </div>

                    <hr />

                    <div>
                      <p className="text-xs">{oneTask.description}</p>
                    </div>

                    <div className="flex justify-between items-center my-2 px-1">
                      <h1>@{oneTask.assignees}</h1>
                      <Dropdown
                        dismissOnClick={true}
                        arrowIcon={false}
                        inline
                        label={
                          <div className="bg-blue-800 hover:bg-blue-900 px-2 pb-3 text-xl rotate-90 text-white">
                            ...
                          </div>
                        }
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setEditTask(oneTask);
                            setTaskData({
                              ...taskData,
                              priority: oneTask.priority,
                              status: oneTask.status,
                            });
                            setOpenEditModal(true);
                          }}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteTask(oneTask.id);
                          }}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown>
                    </div>

                    <button className="px-8 py-1 rounded bg-blue-800 hover:bg-blue-900 text-white">
                      Assign
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="md:w-3/12 h-fit border-2  rounded-lg">
          <div className=" flex justify-center py-2 bg-green-500 rounded-t-lg text-white">
            Completed
          </div>
          {tasks?.map((oneTask, index) => {
            if (oneTask.status === "Completed") {
              return (
                <div key={index}>
                  <div className="bg-gray-100 p-3 m-2 rounded">
                    <div className="flex items-center justify-between my-3">
                      <h1>{oneTask.name}</h1>
                      <button className="bg-blue-800 text-white px-2">
                        {oneTask.priority}
                      </button>
                    </div>

                    <hr />

                    <div>
                      <p className="text-xs">{oneTask.description}</p>
                    </div>

                    <div className="flex justify-between items-center my-2 px-1">
                      <h1>@{oneTask.assignees}</h1>
                      <Dropdown
                        dismissOnClick={true}
                        arrowIcon={false}
                        inline
                        label={
                          <div className="bg-blue-800 hover:bg-blue-900 px-2 pb-3 text-xl rotate-90 text-white">
                            ...
                          </div>
                        }
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setEditTask(oneTask);
                            setTaskData({
                              ...taskData,
                              priority: oneTask.priority,
                              status: oneTask.status,
                            });
                            setOpenEditModal(true);
                          }}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteTask(oneTask.id);
                          }}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown>
                    </div>

                    <button className="px-8 py-1 rounded bg-blue-800 hover:bg-blue-900 text-white">
                      Assign
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="md:w-3/12 h-fit border-2  rounded-lg">
          <div className=" flex justify-center py-2 bg-blue-900 rounded-t-lg text-white">
            Deployed
          </div>
          {tasks?.map((oneTask, index) => {
            if (oneTask.status === "Deployed") {
              return (
                <div key={index}>
                  <div className="bg-gray-100 p-3 m-2 rounded">
                    <div className="flex items-center justify-between my-3">
                      <h1>{oneTask.name}</h1>
                      <button className="bg-blue-800 text-white px-2">
                        {oneTask.priority}
                      </button>
                    </div>

                    <hr />

                    <div>
                      <p className="text-xs">{oneTask.description}</p>
                    </div>

                    <div className="flex justify-between items-center my-2 px-1">
                      <h1>@{oneTask.assignees}</h1>
                      <Dropdown
                        dismissOnClick={true}
                        arrowIcon={false}
                        inline
                        label={
                          <div className="bg-blue-800 hover:bg-blue-900 px-2 pb-3 text-xl rotate-90 text-white">
                            ...
                          </div>
                        }
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setEditTask(oneTask);
                            setTaskData({
                              ...taskData,
                              priority: oneTask.priority,
                              status: oneTask.status,
                            });
                            setOpenEditModal(true);
                          }}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteTask(oneTask.id);
                          }}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown>
                    </div>

                    <button className="px-8 py-1 rounded bg-blue-800 hover:bg-blue-900 text-white">
                      Assign
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="md:w-3/12 h-fit border-2  rounded-lg">
          <div className=" flex justify-center py-2 bg-red-400 rounded-t-lg text-white">
            Deffered
          </div>
          {tasks?.map((oneTask, index) => {
            if (oneTask.status === "Deffered") {
              return (
                <div key={index}>
                  <div className="bg-gray-100 p-3 m-2 rounded">
                    <div className="flex items-center justify-between my-3">
                      <h1>{oneTask.name}</h1>
                      <button className="bg-blue-800 text-white px-2">
                        {oneTask.priority}
                      </button>
                    </div>

                    <hr />

                    <div>
                      <p className="text-xs">{oneTask.description}</p>
                    </div>

                    <div className="flex justify-between items-center my-2 px-1">
                      <h1>@{oneTask.assignees}</h1>
                      <Dropdown
                        dismissOnClick={true}
                        arrowIcon={false}
                        inline
                        label={
                          <div className="bg-blue-800 hover:bg-blue-900 px-2 pb-3 text-xl rotate-90 text-white">
                            ...
                          </div>
                        }
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setEditTask(oneTask);
                            setTaskData({
                              ...taskData,
                              priority: oneTask.priority,
                              status: oneTask.status,
                            });
                            setOpenEditModal(true);
                          }}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteTask(oneTask.id);
                          }}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown>
                    </div>

                    <button className="px-8 py-1 rounded bg-blue-800 hover:bg-blue-900 text-white">
                      Assign
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
