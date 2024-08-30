import { useContext } from "react";
import { IoIosSearch } from "react-icons/io";

import UIContext from "../../../store/ui-context";
import classes from "./AdminSearch.module.css";

const AdminSearch = ({
  searchTerm,
  setSearchTerm,
  searchField,
  setSearchField,
  onSearch,
}) => {
  const uiCtx = useContext(UIContext);

  // 검색 필드 선택 옵션
  const selectOptions = [
    { display: "제목", value: "title" },
    { display: "내용", value: "content" },
    { display: "이름", value: "name" },
  ];

  return (
    <div
      className={`${classes["search-container"]} ${classes[uiCtx.themeClass]}`}
    >
      {/* 검색 필드 선택 (제목, 내용, 이름) */}
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className={`${classes["search-field-select"]} ${
          classes[uiCtx.themeClass]
        }`}
      >
        {/* 검색 필드 옵션들 (제목, 내용, 이름) */}
        {selectOptions.map((option, index) => (
          <option
            key={index}
            value={option.value} // 필드 값 (title, content, name)
            className={`${classes["search-field-option"]} ${
              classes[uiCtx.themeClass]
            }`}
          >
            {/* 필드 이름 (제목, 내용, 이름) */}
            {option.display}
          </option>
        ))}
      </select>

      {/* 검색어 입력과 검색 버튼 */}
      <div
        className={`${classes["search-term-container"]} ${
          classes[uiCtx.themeClass]
        }`}
      >
        <input
          type="text"
          className={`${classes["search-term-input"]} ${
            classes[uiCtx.themeClass]
          }`}
          placeholder="게시글 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoIosSearch
          onClick={onSearch}
          className={`${classes["search-term-icon"]} ${
            classes[uiCtx.themeClass]
          }`}
        />
      </div>
    </div>
  );
};

export default AdminSearch;
