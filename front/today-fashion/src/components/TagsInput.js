import React, { useEffect, useState } from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Downshift from 'downshift';
import axios from 'axios';
import { SERVER_URL } from '../config';
import { Icon, InlineIcon } from '@iconify/react';
import searchIcon from '@iconify-icons/akar-icons/search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
}));

const TagsInput = ({ ...props }) => {
  const classes = useStyles();
  const {
    selectedTags,
    placeholder,
    tags,
    // inputValue,
    // setInputValue,
    // selectedItem,
    // setSelectedItem,
    // autoCompleteItems,
    // setAutoCompleteItems,
    ...other
  } = props;
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [autoCompleteItems, setAutoCompleteItems] = useState([]);
  const [autoCompleteError, setAutoCompleteError] = useState();
  let cancelToken;

  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    setSelectedItems(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(selectedItems);
    //tag 갱신
  }, [selectedItems, selectedTags]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      const newSelectedItems = [...selectedItems];
      const valueToAdd = event.target.value.toLowerCase().trim();
      //'apple'과 'apple  '을 똑같이 취급한다

      if (newSelectedItems.includes(valueToAdd)) {
        setInputValue('');
        //중복되는 태그이면 새로 더하지 않는다
        return;
      }

      if (!event.target.value.replace(/\s/g, '').length) return;
      //내용이 공백뿐일때는 아무것도 하지 않는다

      //위의 예외들에 해당하지 않고,
      //검색어가 자동완성에 포함된다면 새로운 태그를 더한다.
      if (autoCompleteItems.includes(valueToAdd)) {
        newSelectedItems.push(valueToAdd);
        setSelectedItems(newSelectedItems);
        setInputValue('');
      }
    }
    if (
      selectedItems.length &&
      !inputValue.length &&
      event.key === 'Backspace'
    ) {
      //태그가 있고 inputvalue는 없을때 백스페이스 누르면 태그 삭제
      setSelectedItems(selectedItems.slice(0, selectedItems.length - 1));
    }
  };
  const handleChange = (item) => {
    let newSelectedItems = [...selectedItems];
    if (!newSelectedItems.includes([item])) {
      //newSelectedItem에 item이 없으면
      newSelectedItems = [...newSelectedItems, item]; //item을 추가
    }
    setInputValue('');
    setSelectedItems(newSelectedItems);
  };

  const handleDelete = (item) => () => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems.splice(newSelectedItems.indexOf(item), 1);
    setSelectedItems(newSelectedItems);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    //TODO: 자동완성 결과도 다시 불러오기
  };

  const [searchRows, setSearchRows] = useState(1);

  useEffect(() => {
    getAutoComplete({ existingKeywords: selectedItems, keyword: inputValue });
  }, [inputValue, selectedItems]);

  const getAutoComplete = async (data) => {
    if (data.keyword !== '') {
      if (typeof cancelToken != typeof undefined) {
        cancelToken.cancel('Operation canceled due to new request.');
      }
      cancelToken = axios.CancelToken.source();
      try {
        const res = await axios.post(SERVER_URL + '/search', data, {
          cancelToken: cancelToken.token,
        });
        console.log(res);
        setAutoCompleteItems(res.data.keywords);
        if (!res.data.keywords.length) {
          setAutoCompleteError(res.data.msg);
        }
        setSearchRows(
          autoCompleteItems.length + (autoCompleteError?.length ? 0 : 1)
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      setAutoCompleteItems([]);
      setAutoCompleteError();
    }
  };

  const [responseWidth, setResponseWidth] = useState();
  useEffect(() => {
    {
      isMobile ? setResponseWidth('80%') : setResponseWidth('50%');
    }
  }, [isMobile]);

  return (
    <>
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={handleChange}
        selectedItem={selectedItems}
      >
        {({
          getInputProps,
          getMenuProps,
          isOpen,
          getItemProps,
          highlightedIndex,
        }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onKeyDown: handleKeyDown,
            placeholder,
          });
          return (
            <div style={{ width: responseWidth, margin: '0 Auto' }}>
              <TextField
                style={{ border: '0px solid' }}
                fullWidth
                InputProps={{
                  startAdornment: selectedItems.map((item) => (
                    <Chip
                      color="primary"
                      key={item}
                      tabIndex={-1}
                      label={item}
                      className={classes.chip}
                      onDelete={handleDelete(item)}
                    />
                  )),
                  onBlur,
                  onChange: (event) => {
                    handleInputChange(event);
                    onChange(event);
                  },
                  onFocus,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon icon={searchIcon} height="24px" />
                    </InputAdornment>
                  ),
                }}
                {...other}
                {...inputProps}
              />
              <div {...getMenuProps()}>
                {isOpen && autoCompleteItems.length ? (
                  autoCompleteItems.map((item, index) => (
                    <div
                      {...getItemProps({
                        key: item,
                        index,
                        item: item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? 'lightgray' : 'white',
                          cursor: 'pointer',
                        },
                      })}
                    >
                      {item}
                    </div>
                  ))
                ) : isOpen ? (
                  <div>{autoCompleteError ? autoCompleteError : null}</div>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
    </>
  );
};

TagsInput.defaultProps = {
  tags: [],
};

export default TagsInput;
