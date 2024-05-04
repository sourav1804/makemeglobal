import React, { useState, useEffect } from 'react';

function TreeNode({ node, onLabelChange, onAddChild, selectedNode, onSelectNode, offsetX = 0, offsetY = 0 }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(node.label);

  const isSelected = selectedNode && selectedNode === node;

  const handleNodeClick = () => {
    onSelectNode(node);
  };

  const handleLabelChange = (e) => {
    setEditedLabel(e.target.value);
  };

  const handleLabelSubmit = () => {
    onLabelChange(node, editedLabel);
    setIsEditing(false);
  };

  useEffect(() => {
    setEditedLabel(node.label);
  }, [node.label]);

  return (
    <g>
      <circle
        cx={node.x + offsetX}
        cy={node.y + offsetY}
        r={20}
        fill={isSelected ? 'lightgreen' : 'lightblue'}
        onClick={handleNodeClick}
      />
      {isEditing ? (
        <foreignObject x={node.x + offsetX - 50} y={node.y + offsetY - 30} width="100" height="40">
          <input
            type="text"
            value={editedLabel}
            onChange={handleLabelChange}
            onBlur={handleLabelSubmit}
            autoFocus
          />
        </foreignObject>
      ) : (
        <text x={node.x + offsetX} y={node.y - 25 + offsetY} textAnchor="middle" onClick={() => setIsEditing(true)}>
          {node.label}
        </text>
      )}
      {node.children.map((child, index) => (
        <g key={index}>
          {/* Draw perpendicular line */}
          <line x1={node.x + offsetX} y1={node.y + offsetY} x2={child.x + offsetX} y2={node.y + offsetY} stroke="black" />
          <line x1={child.x + offsetX} y1={node.y + offsetY} x2={child.x + offsetX} y2={child.y + offsetY} stroke="black" />
          <TreeNode
            node={child}
            onLabelChange={onLabelChange}
            onAddChild={onAddChild}
            selectedNode={selectedNode}
            onSelectNode={onSelectNode}
            offsetX={offsetX}
            offsetY={offsetY}
          />
        </g>
      ))}
    </g>
  );
}

function Tree() {
  const [tree, setTree] = useState({
    label: 'Root',
    x: 300,
    y: 100,
    children: [],
  });
  const [label, setLabel] = useState('Root');
  const [labelSubmitted, setLabelSubmitted] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setTree(prevTree => ({
      ...prevTree,
      label: label
    }));
  }, [label]);

  const handleLabelChange = (targetNode, newLabel) => {
    if (targetNode === selectedNode) {
      targetNode.label = newLabel;
      setTree({ ...tree });
    }
  };

  const handleAddChild = (parentNode, side, level) => {
    if (!selectedNode) {
      alert('Please select a node first.');
      return;
    }

    const branchLength = 50 - level * 10; // Decrease branch length with each level more significantly
    const newX = parentNode.x + (side === 'left' ? -50 : 50) + (side === 'left' ? -1 : 1) * branchLength;
    const newY = parentNode.y + 50 + level * 50; // Increase vertical spacing with each level

    const newNode = {
      label: selectedNode.label,
      x: newX,
      y: newY,
      children: [],
    };

    parentNode.children.push(newNode);
    setTree({ ...tree });
  };

  const handleLabelSubmit = () => {
    if (label.trim() !== '') {
      setLabelSubmitted(true);
      if (selectedNode) {
        handleLabelChange(selectedNode, label);
      }
    }
  };

  return (
    <div>
      <label>
        Enter label:
        <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
      </label>
      <button onClick={handleLabelSubmit}>Submit Label</button>
      {labelSubmitted && (
        <div>
          <svg width="100%" height="500">
            <TreeNode
              node={tree}
              onLabelChange={handleLabelChange}
              onAddChild={handleAddChild}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              offsetX={300 - tree.x}
              offsetY={100 - tree.y}
            />
          </svg>
          <div>
            <button onClick={() => handleAddChild(selectedNode, 'left', 1)}>Add Left Branch</button>
            <button onClick={() => handleAddChild(selectedNode, 'right', 1)}>Add Right Branch</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tree;
