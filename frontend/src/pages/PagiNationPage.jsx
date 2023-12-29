import Pagination from "../components/Posts/PagiNation";

const PaginationPage = () => {
  return (
    <>
      <Pagination />
    </>
  );
};

export default PaginationPage;

export const loader = async ({ params }) => {
  const response = await fetch(
    "http://localhost:3000/posts?page=" + params.pageNum
  );
  const resData = await response.json();
  return resData;
};
