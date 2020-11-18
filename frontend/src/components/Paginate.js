//we don't call the page pagination because that's the react built in component.
import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && ( //we only do this if there is more than one page
      //we need to take the number of pages and map through that as an array.
      //we can use x + 1 for page numbers because this only gets called if there is more than one page. JS arrays are zero indexed so page one would be mapped as 0, page# would be 0 + 1 = 1.
      //Page 2 would be mapped as 1, so 1 + 1 = 2. etc.
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
