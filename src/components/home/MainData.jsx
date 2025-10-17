// ✅ FULL CLEAN MAIN DATA - FINAL LOCKED VERSION (DROPDOWN LIKE GOOGLE DRIVE)

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  ArrowDownIcon,
  MoreOptionsIcon,
  StarFilledIcon,
  StarBorderIcon,
  DownloadIcon,
  CopyIcon,
  DeleteIcon,
  ShareIcon,
} from "../common/SvgIcons";
import { changeBytes, convertDates } from "../common/common";
import FileIcons from "../common/FileIcons";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { handleStarred } from "../common/firebaseApi";
import { toast } from "react-toastify";
import LottieImage from "../common/LottieImage";
import { ref, getBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { decryptBytes } from "../utils/crypto";

const MainData = ({ files, handleOptionsClick, optionsVisible, handleDelete }) => {
  const [showShareIcons, setShowShareIcons] = useState(false);
  const optionsMenuRef = useRef(null);

  const handleDownloadEncrypted = async (fileDoc) => {
    try {
      const passphrase = prompt("Enter password to decrypt:");
      if (!passphrase) return;

      const filePath = fileDoc.data?.path;
      if (!filePath) return alert("❌ Missing path to encrypted file.");

      const encryptedRef = ref(storage, filePath);
      const encryptedBytes = await getBytes(encryptedRef);
      const plainBytes = await decryptBytes(encryptedBytes, fileDoc.data.crypto);

      const blob = new Blob([plainBytes], {
        type: fileDoc.data.originalType || "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileDoc.data.filename || "file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Wrong password or encrypted file was altered.");
    }
  };

  const handleShareClick = () => setShowShareIcons((v) => !v);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target) &&
        !event.target.closest(".optionsContainer") &&
        !event.target.closest(".shareButton")
      ) {
        setShowShareIcons(false);
        handleOptionsClick(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOptionsClick]);

  return (
    <div>
      {files.length > 0 && (
        <DataListRow>
          <div><b><ArrowDownIcon /> Name</b></div>
          <div className="fileSize"><b>File Size</b></div>
          <div className="modified"><b>Last Modified</b></div>
          <div><b>Options</b></div>
        </DataListRow>
      )}

      {files.length > 0 ? (
        files.map((file) => (
          <DataListRow key={file.id}>
            <div>
              <p className="starr" onClick={() => handleStarred(file.id)}>
                {file.data.starred ? <StarFilledIcon /> : <StarBorderIcon />}
              </p>
              {file.data.isEncrypted ? (
                <>
                  <FileIcons type={file.data.originalType || file.data.contentType} />
                  <span title={file.data.filename}>🔒 {file.data.filename}</span>
                </>
              ) : (
                <a href={file.data.fileURL} target="_blank" rel="noopener noreferrer">
                  <FileIcons type={file.data.contentType} />
                  <span title={file.data.filename}>{file.data.filename}</span>
                </a>
              )}
            </div>

            <div className="fileSize">{changeBytes(file.data.size)}</div>
            <div className="modified">{convertDates(file.data.timestamp?.seconds)}</div>

            <div>
              <OptionsTrigger className="optionsContainer" onClick={() => handleOptionsClick(file.id)}>
                <MoreOptionsIcon />
              </OptionsTrigger>

              {optionsVisible === file.id && (
                <OptionsMenu ref={optionsMenuRef}>
                  {file.data.isEncrypted ? (
                    <MenuItem onClick={() => handleDownloadEncrypted(file)}>
                      <DownloadIcon /> Decrypt & Download
                    </MenuItem>
                  ) : (
                    <MenuItem as="a" href={file.data.fileURL} download target="_blank">
                      <DownloadIcon /> Download
                    </MenuItem>
                  )}

                  <MenuItem onClick={() => { navigator.clipboard.writeText(file.data.fileURL); toast.success("Link Copied"); }}>
                    <CopyIcon /> Copy Link
                  </MenuItem>

                  <ShareButton className="shareButton" onClick={handleShareClick}>
                    <ShareIcon /> Share
                    <SharePopover className={showShareIcons ? "show" : ""}>
                      <EmailShareButton url={file.data.fileURL}><EmailIcon size={32} round /></EmailShareButton>
                      <FacebookShareButton url={file.data.fileURL}><FacebookIcon size={32} round /></FacebookShareButton>
                      <LinkedinShareButton url={file.data.fileURL}><LinkedinIcon size={32} round /></LinkedinShareButton>
                      <WhatsappShareButton url={file.data.fileURL}><WhatsappIcon size={32} round /></WhatsappShareButton>
                    </SharePopover>
                  </ShareButton>

                  <MenuItem className="delete" onClick={() => handleDelete(file.id, file.data)}>
                    <DeleteIcon /> Delete
                  </MenuItem>

                  {/* ✅ META INFO (KEPT INSIDE DROPDOWN, SAME STYLE) */}
                  <MenuItem disabled>📅 {convertDates(file.data.timestamp?.seconds)}</MenuItem>
                  <MenuItem disabled>📦 {changeBytes(file.data.size)}</MenuItem>
                </OptionsMenu>
              )}
            </div>
          </DataListRow>
        ))
      ) : (
        <LottieImage imagePath={"/homePage.svg"} text1={"A place for all of your files"} text2={"Use the 'New' button to upload"} />
      )}
    </div>
  );
};

export default MainData;

/* ✅ STYLES BELOW */

const DataListRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr;
  border-bottom: 1px solid #ccc;
  padding: 10px;
`;

const OptionsTrigger = styled.span`
  cursor: pointer;
  svg { padding: 6px; border-radius: 50%; transition: background 0.15s; }
  svg:hover { background: rgba(0,0,0,0.08); }
  body.dark-mode & svg:hover { background: rgba(255,255,255,0.12); }
`;

const OptionsMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  z-index: 50;
  background: var(--menu-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const MenuItem = styled.span`
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  cursor: pointer;
  &:hover { background: var(--menu-hover); }
  &.delete { color: #e63946 !important; }
`;

const ShareButton = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const SharePopover = styled.span`
  position: absolute;
  top: -95px;
  left: -60px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  background: var(--menu-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: var(--shadow);
  opacity: 0;
  visibility: hidden;
  transition: 0.2s;
  &.show { opacity: 1; visibility: visible; }
`;
