import { storyApi } from "../../stores/story"

interface DeletePlotButtonProps {
    plotId: string;
}

export default (props: DeletePlotButtonProps) => {
    const deletePlot = () => {
        if (confirm('Delete this Plot?')) {
            storyApi.deleteEntity('plots', props.plotId);
        }
    };
    return (
        <button class='delete' onclick={deletePlot}>Delete</button>
    )
}