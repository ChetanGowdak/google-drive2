import React from "react";
import styled from "styled-components";
import FileCard3D from "./FileCard3D";

export default function Recent3DPreview({ recentFiles }) {
  return (
    <GridWrapper>
      {recentFiles.slice(0, 4).map((file) => (
        <FileCard3D key={file.id} file={file} />
      ))}
    </GridWrapper>
  );
}

const GridWrapper = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 20px;
`;
