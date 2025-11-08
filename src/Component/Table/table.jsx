import React from 'react';
import './table.css';

const Table = ({ users }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((curData) => {
            const { EmpID, EmpName, EmpEmail, EmpDept, EmpRole } = curData;
            return (
              <tr key={EmpID}>
                <td>{EmpID || ''}</td>
                <td>{EmpName || ''}</td>
                <td>{EmpEmail || ''}</td>
                <td>{EmpDept || ''}</td>
                <td>{EmpRole || ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
