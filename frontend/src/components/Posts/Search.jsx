import { useContext } from "react";
import { IoIosSearch } from "react-icons/io";

import AuthContext from "../../store/auth-context";
import classes from "./Search.module.css";

const Search = ({
  searchTerm,
  setSearchTerm,
  searchField,
  setSearchField,
  onSearch,
}) => {
  const authCtx = useContext(AuthContext);

  // 검색 필드 선택 옵션
  const selectOptions = [
    { display: "제목", value: "title" },
    { display: "내용", value: "content" },
    { display: "이름", value: "name" },
  ];

  return (
    <div
      className={`${classes["search-container"]} ${
        classes[authCtx.themeClass]
      }`}
    >
      {/* 검색 필드 선택 (제목, 내용, 이름) */}
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className={`${classes["search-field-select"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        {/* 검색 필드 옵션들 (제목, 내용, 이름) */}
        {selectOptions.map((option, index) => (
          <option
            key={index}
            value={option.value} // 필드 값 (title, content, name)
            className={`${classes["search-field-option"]} ${
              classes[authCtx.themeClass]
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
          classes[authCtx.themeClass]
        }`}
      >
        <input
          type="text"
          className={`${classes["search-term-input"]} ${
            classes[authCtx.themeClass]
          }`}
          placeholder="게시글 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoIosSearch
          onClick={onSearch}
          className={`${classes["search-term-icon"]} ${
            classes[authCtx.themeClass]
          }`}
        />
      </div>
    </div>
  );
};

export default Search;
