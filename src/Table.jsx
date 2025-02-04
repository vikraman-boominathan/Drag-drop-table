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
  const [draggedRow, setDraggedRow] = useState(null);
  const [targetRow, setTargetRow] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [targetColumn, setTargetColumn] = useState(null);

  const rowRef = useRef([]);
  const colRef = useRef([]);

  useEffect(() => {
    rowRef.current.forEach((rowEl, index) => {
      if (rowEl) {
        combine(
          draggable({
            element: rowEl,
            getInitialData() {
              setDraggedRow(index);
              return { index, id: items[index].id };
            },
          }),
          dropTargetForElements({
            element: rowEl,
            getData() {
              return { index };
            },
            onDragEnter() {
              if (index !== draggedRow) setTargetRow(index);
            },
            onDragLeave() {
              setTargetRow(null);
            },
            onDrop({ source, self }) {
              if (source.data.index !== self.data.index) {
                const newItems = [...items];
                const [dropped] = newItems.splice(source.data.index, 1);
                newItems.splice(self.data.index, 0, dropped);
                setItems(newItems);
              }
              setDraggedRow(null);
              setTargetRow(null);
            },
          })
        );
      }
    });
  }, [items, draggedRow]);

  useEffect(() => {
    colRef.current.forEach((colEl, index) => {
      if (colEl) {
        combine(
          draggable({
            element: colEl,
            getInitialData() {
              setDraggedColumn(index);
              return { index };
            },
          }),
          dropTargetForElements({
            element: colEl,
            getData() {
              return { index };
            },
            onDragEnter() {
              if (index !== draggedColumn) setTargetColumn(index);
            },
            onDragLeave() {
              setTargetColumn(null);
            },
            onDrop({ source, self }) {
              if (source.data.index !== self.data.index) {
                const newColumns = [...columns];
                const [dropped] = newColumns.splice(source.data.index, 1);
                newColumns.splice(self.data.index, 0, dropped);
                setColumns(newColumns);
              }
              setDraggedColumn(null);
              setTargetColumn(null);
            },
          })
        );
      }
    });
  }, [columns, draggedColumn]);

  return (
    <div className="h-64 overflow-y-auto">
      <table className="table-fixed w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-2 border ${
                  draggedColumn === index
                    ? "bg-blue-300" 
                    : targetColumn === index
                    ? "opacity-50"  
                    : ""
                }`}
                ref={(el) => (colRef.current[index] = el)}
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
              className={`border ${
                draggedRow === rowIndex
                  ? "bg-yellow-300"
                  : targetRow === rowIndex
                  ? "opacity-50 bg-red-300"
                  : ""
              }`}
              ref={(el) => (rowRef.current[rowIndex] = el)}
            >
              {columns.map((col) => (
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
