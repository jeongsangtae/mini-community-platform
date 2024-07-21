import { useContext } from "react";
import { IoIosSearch } from "react-icons/io";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminSearch.module.css";

const AdminSearch = ({
  searchTerm,
  setSearchTerm,
  searchField,
  setSearchField,
  onSearch,
}) => {
  const authCtx = useContext(AuthContext);

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
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className={`${classes["search-field-select"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        {selectOptions.map((option, index) => (
          <option
            key={index}
            value={option.value}
            className={`${classes["search-field-option"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            {option.display}
          </option>
        ))}
      </select>

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

export default AdminSearch;
