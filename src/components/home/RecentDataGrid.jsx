import React from "react";
import styled from "styled-components";
import FileIcons from "../common/FileIcons";
import Recent3DPreview from "../three/Recent3DPreview";
import FileCard3D from "../three/FileCard3D"; // ✅ Make sure file exists in /three/


const RecentDataGrid = ({ files }) => {
  return (
    <DataGrid>
      {files.slice(0, 4).map((file) => (
        <FileCard3D key={file.id} file={file} />
      ))}
    </DataGrid>
  );
};


const DataGrid = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;

  @media screen and (max-width: 768px) {
    display: none;
  }

  p {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DataFile = styled.a`
  text-align: center;
  border: 1px solid rgb(204 204 204 / 46%);
  margin: 10px;
  min-width: 200px;
  padding: 10px 0px 0px 0px;
  border-radius: 5px;
  text-decoration: none;
  max-width: 250px;
  p {
    color: #000;
    font-weight: 600;
  }
  svg {
    font-size: 60px;
    color: gray;
  }
  p {
    border-top: 1px solid #ccc;
    margin-top: 5px;
    font-size: 12px;
    background: whitesmoke;
    padding: 10px 0px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    width: 100%;
  }
`;

export default RecentDataGrid;
