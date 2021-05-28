import React, { useEffect, useState } from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Downshift from 'downshift';

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
}));

const TagsInput = ({ ...props }) => {
  const classes = useStyles();
  const { selectedTags, placeholder, tags, ...other } = props;
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState([]);
  const [autoCompleteItems, setAutoCompleteItems] = useState([
    'apple',
    'pear',
    'peach',
    'grape',
    'orange',
    'banana',
  ]);

  useEffect(() => {
    setSelectedItem(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(selectedItem);
    //tag 갱신
  }, [selectedItem, selectedTags]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const newSelectedItem = [...selectedItem];
      const valueToAdd = event.target.value.toLowerCase().trim();

      const duplicatedValues = newSelectedItem.indexOf(
        valueToAdd
        //'apple'과 'apple  '을 똑같이 취급한다
      );

      if (duplicatedValues !== -1) {
        setInputValue('');
        //중복되는 태그이면 새로 더하지 않는다
        return;
      }

      if (!event.target.value.replace(/\s/g, '').length) return;
      //내용이 공백뿐일때는 아무것도 하지 않는다

      //TODO
      //자동완성 dropdown에서 엔터하면 input의 내용은 추가 하지 않는 조건 필요
      //자동완성의 단어들 중에서만 tag를 등록할 수 있게 하기

      //위의 예외들에 해당하지 않고,
      //검색어가 자동완성에 포함된다면 새로운 태그를 더한다.
      if (autoCompleteItems.includes(valueToAdd)) {
        newSelectedItem.push(valueToAdd);
        setSelectedItem(newSelectedItem);
      }

      //자동완성에 포함되지 않는 단어라면 추가를 허용하지 않고, 강제로 비운다.
      //setInputValue('');
    }
    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === 'Backspace'
    ) {
      //태그가 있고 inputvalue는 없을때 백스페이스 누르면 태그 삭제
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
    }
  };
  const handleChange = (item) => {
    let newSelectedItem = [...selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      //newSelectedItem에 item이 없으면
      newSelectedItem = [...newSelectedItem, item]; //item을 추가
    }
    setInputValue('');
    setSelectedItem(newSelectedItem);
  };

  const handleDelete = (item) => () => {
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setSelectedItem(newSelectedItem);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    //TODO: 자동완성 결과도 다시 불러오기
  };

  return (
    <>
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={handleChange}
        selectedItem={selectedItem}
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
            <div>
              <TextField
                InputProps={{
                  startAdornment: selectedItem.map((item) => (
                    <Chip
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
                }}
                {...other}
                {...inputProps}
              />
              <div {...getMenuProps()}>
                {isOpen ? (
                  <div>there is no such keyword...</div>
                ) : autoCompleteItems.length ? (
                  autoCompleteItems.map((item, index) => (
                    <div
                      {...getItemProps({
                        key: item,
                        index,
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? 'lightgray' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal',
                          cursor: 'pointer',
                        },
                      })}
                    >
                      {item}
                    </div>
                  ))
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
