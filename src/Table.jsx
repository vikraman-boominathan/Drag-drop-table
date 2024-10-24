import { useState, useRef, useEffect } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

export default function Table() {
  const [items, setItems] = useState([
    { id: 1, name: "Task Alpha", status: "Pending", assignee: "Alice" },
    { id: 2, name: "Project Beta", status: "Completed", assignee: "Bob" },
    { id: 3, name: "Review Gamma", status: "In Progress", assignee: "Charlie" },
    { id: 4, name: "Deployment Delta", status: "Open", assignee: "Diana" },
    { id: 5, name: "Feature Epsilon", status: "Closed", assignee: "Eve" },
    { id: 6, name: "Bug Fix Zeta", status: "In Review", assignee: "Frank" },
    { id: 7, name: "Update Theta", status: "Pending", assignee: "Grace" },
    { id: 8, name: "Design Iota", status: "Completed", assignee: "Hank" },
    { id: 9, name: "Testing Kappa", status: "In Progress", assignee: "Ivy" },
    { id: 10, name: "Optimization Lambda", status: "Open", assignee: "Jack" },
  ]);

  const [columns, setColumns] = useState(["name", "status", "assignee"]);
  const [rowIndex, setRowIndex] = useState(null);

  const ref = useRef([]);

  useEffect(() => {
    ref.current = ref.current.slice(0, items.length);

    ref.current.forEach(
      (rowRef, index) => {
        if (rowRef) {
          return combine(
            draggable({
              element: rowRef,
              getInitialData() {
                return {
                  index,
                  id: items[index].id,
                };
              },
              onDragStart: () => {
                setRowIndex(index);
              },
              onDrop: () => {
                setRowIndex(null);
              },
            }),
            dropTargetForElements({
              element: rowRef,
              getData() {
                return {
                  index
                };
              },
              onDrop({ source, self }) {
                if (source.data.index !== self.data.index) {
                  const newItems = [...items]
                  const dropped = newItems[source.data.index]
                  newItems.splice(source.data.index,1)
                  newItems.splice(self.data.index, 0, dropped)
                  setItems(newItems)
                }
              },
            })
          );
        }
      },
      
    );

    // const monitor = monitorForElements({
    //   canMonitor: ({ source }) => true,
    //   onDrop: ({ location, source }) => {
    //     const startIndex = source.data.index;
    //     const destinationIndex = location.current.dropTargets[0];
    //     console.log(startIndex, destinationIndex);
    //   },
    // });

    // return () => {
    //   monitor();
    // };
  }, [items]);

  return (
    <div className="h-64 overflow-y-auto">
      <table className="table-fixed w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, index) => (
              <th
                key={index}
                className="p-2 border"
                data-index={index}
                data-type="column"
              >
                {col.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIndex) => (
            <tr
              key={item.id}
              className="border"
              data-index={rowIndex}
              data-type="row"
              ref={(el) => (ref.current[rowIndex] = el)}
            >
              {columns.map((col, colIndex) => (
                <td key={col} className="p-2">
                  {item[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
