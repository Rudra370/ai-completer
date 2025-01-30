import ChevronUp from "../../assets/chevronup.svg";
import { useQueryParams } from "../../hooks/params";
import "./collapsable.css";

interface CollapsableProps {
    title: string;
    children: React.ReactNode;
    tabNumber?: number;
}

export default function Collapsable(props: CollapsableProps) {
    const { get, set, remove } = useQueryParams();

    const changeTab = () => {
        remove("tab");

        if (get("tab") !== props.tabNumber?.toString()) {
            set("tab", props.tabNumber?.toString() || "");
        }
    }

    return (
        <div className="collapsable">
            <div className="row" onClick={changeTab}>
                <h4>{props.title}</h4>
                <img src={ChevronUp} className={`chevron ${get("tab") !== props.tabNumber?.toString() ? 'rotate' : ''}`} alt="chevron" />
            </div>
            {get("tab") === props.tabNumber?.toString() && <div className="collapsable_children">
                {props.children}
            </div>}
        </div>
    )
}
