import React, { createContext, useContext, useState } from 'react';
import HomeStyle from './Home.style';
import TodoString from './String.json';
import { Label, Pivot, PivotItem, Stack } from '@fluentui/react';
import { ITask, PivotKeysEnum } from './Types';
import TaskList from './List/TaskList';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import TodoProvider from './TodoProvider';
import TaskForm from './TaskForm/TaskForm';
import CompletedTaskList from './List/CompletedTaskList';
initializeIcons();



const Home = () => {
    const [selectedKey, setSelectedKey] = useState<string>(PivotKeysEnum.Tasks);

    const [editTaskId, setEditTaskId] = useState<string | null>(null);

    const editTask = (id: string) => {
        setEditTaskId(id)
        setSelectedKey(PivotKeysEnum.TaskForm)
    }

    return (
        <Stack className={HomeStyle.todoContainer}>
            <TodoProvider>
                <header className={HomeStyle.headerStyle}>
                    <h2>{TodoString.header}</h2>
                </header>
                <Stack className={HomeStyle.pivotContainer}>
                    <Pivot selectedKey={String(selectedKey)} styles={{ root: HomeStyle.pivotRoot }}
                        onLinkClick={(item?: PivotItem) => {
                            if (item?.props.itemKey !== PivotKeysEnum.TaskForm) {
                                setEditTaskId(null);
                            }
                            setSelectedKey(item?.props.itemKey || PivotKeysEnum.Tasks);
                        }}>
                        <PivotItem headerText={TodoString.pivots.TaskTab} itemKey={PivotKeysEnum.Tasks}>
                            <TaskList setEditTask={editTask} />
                        </PivotItem>
                        <PivotItem
                            headerText={TodoString.pivots.TaskFormTab}
                            itemKey={PivotKeysEnum.TaskForm}>
                            <TaskForm editTaskId={editTaskId} />
                        </PivotItem>
                        <PivotItem
                            headerText={TodoString.pivots.CompletedTaskTab}
                            itemKey={PivotKeysEnum.Completed}>
                            <CompletedTaskList/>
                        </PivotItem>
                    </Pivot>
                </Stack>
            </TodoProvider>
        </Stack>
    );
};

export default Home;