import { FontIcon, TeachingBubble, mergeStyles } from '@fluentui/react';
import TaskListStyle from './TaskList.style';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { type } from 'os';
import { ITask } from '../Types';

type Props = {
    task: ITask
}

const TaskDescription = ({ task }: Props) => {

    const buttonId = useId('targetButton');
    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false);

    return (
        <>
            <FontIcon
                id={buttonId}
                iconName="Info"
                className={task.description? TaskListStyle.iconStyle : mergeStyles(TaskListStyle.disabled)}
                onClick={task.description ?  toggleTeachingBubbleVisible : ()=>{}}
            />
            {teachingBubbleVisible &&
                <TeachingBubble
                    target={`#${buttonId}`}

                    headline={task.title} onDismiss={toggleTeachingBubbleVisible}
                >

                    {task.description}
                </TeachingBubble>
            }
        </>
    );
};

export default TaskDescription;