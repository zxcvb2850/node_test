import React, {useEffect, useState, useRef} from "react"
import Head from "next/head";

let LIMIT = 20;
const width = 200;
const minGap = 20;
const Index = (props) => {
  const {data} = props;
  const bannerWrapEl = useRef(null);
  const wrapperEl = useRef(null);
  const [contents, setContents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT);
  const [leftNum, setLeftNum] = useState(1); // 距离左边的距离
  const [column, setColumn] = useState(0); // 共有多少列图片
  const [lastIndex, setLastIndex] = useState(0); // 最后一个index

  useEffect(() => {
	waterfallDom();
  }, []);
  useEffect(() => {
	console.log("update contents:", contents);
  }, [contents]);

  const getDataList = async ({page = 2, limit = LIMIT}) => {
	console.log("page", page);
	console.log("limit", limit);
	const res = await fetch(`http://localhost:9797/api/img?page=${page}&limit=${limit}`);
	const result = await res.json();
	if (result && result.code === 200) {
	  const data = result.data.list;
	  console.log("==contents==", contents);
	  const calcListData = calcRearrangeDom(contents, data, column, leftNum);
	  console.log("==calcList==", calcListData);
	  setTimeout(()=>{
		setContents(calcListData.list);
		setLastIndex(calcListData.index);
	  }, 300);
	}
  };

  const doInBottom = () => {
	const {clientHeight, scrollTop} = document.documentElement;
	const windowHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
	if (clientHeight + scrollTop === windowHeight) {
	  const currentPage = Number(page + 1);
	  setPage(currentPage);

	  getDataList({page: currentPage, limit});
	}
  };

  useEffect(() => {
	window.addEventListener('scroll', doInBottom);

	return () => {
	  window.removeEventListener('scroll', doInBottom);
	}
  }, [doInBottom]);

  const waterfallDom = () => {
	let scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
	scrollWidth = scrollWidth > 1200 ? 1200 : scrollWidth;
	wrapperEl.current.style.width = `${scrollWidth}px`;
	const column = Math.floor(scrollWidth / (width + minGap)); // 工有多少列数据
	const leftNum = Math.ceil((column - 3) / 2); // 左边有几列
	setLeftNum(leftNum);
	setColumn(column);
	bannerWrapEl.current.style.left = `${leftNum * (width + minGap)}px`;
	const list = contents || [];
	for (let i = 0; i < column; i++) {
	  if (!list[i]) {
		list[i] = []
	  }
	}

	const calcListData = calcRearrangeDom(list, data, column, leftNum, true);
	setContents(calcListData.list);
	setLastIndex(calcListData.index);
  };

  const calcRearrangeDom = (list, data, column, leftNum, isFirst = false) => {
	const len = data.length;
	let lastCurrIndex = 0;
	// todo 计算位置l
	for (let i = 0; i < len; i++) {
	  const item = data[i];
	  let index = i % column;
	  const lineNum = column - 3;
	  // todo lineNum * 3(banner所占的高度)
	  const allLineNum = lineNum * 3;
	  if (isFirst && i > (leftNum - 1) && i < allLineNum) {
		const current = i % lineNum;
		if (current >= leftNum) {
		  index = current + 3;
		} else {
		  index = current
		}
	  } else {
		const diff = (isFirst ? i : (lastIndex + i)) - (isFirst ? allLineNum : 0);
		index = ((i >= allLineNum) || !isFirst) ? (diff % column) : index;
	  }

	  list[index].push(item);
	  lastCurrIndex = index + 1;
	}
	return {list, index: lastCurrIndex};
  };

  return (
	<>
	  <Head>
		<title>瀑布流</title>
		<style>
		  {`
		  *{margin:0;padding:0;}
		  .card-item {margin-right: 20px;}
		  `}
		</style>
	  </Head>
	  <div
		ref={wrapperEl}
		style={{position: 'relative', margin: '0 auto', display: 'flex'}}
	  >
		<div
		  ref={bannerWrapEl}
		  style={{
			position: 'absolute',
			top: 10,
			left: 0,
			width: 640,
			height: 500,
			color: '#FFF',
			backgroundColor: '#737372'
		  }}
		>Banner
		</div>
		{
		  contents.map((item, index) => (
			<ul
			  className="card-item"
			  key={index}
			  style={{
				width: 200,
				listStyleType: 'none',
				marginTop: (index > (leftNum - 1) && index < leftNum + 3) ? '520px' : '0'
			  }}
			>
			  {
				item && item.map(_item => (
				  <li key={_item.id} style={{marginBottom: 10}}>
					<CardItem
					  item={_item}
					/>
				  </li>
				))
			  }
			</ul>
		  ))
		}
	  </div>
	</>
  )
};

Index.getInitialProps = async (ctx) => {
  const res = await fetch(`http://localhost:9797/api/img?page=1&limit=${LIMIT}`);
  const result = await res.json();
  return {data: result.data.list, msg: result.message};
};

const CardItem = ({item}) => {
  const random = (start = 0, end = 0) => {
	const diff = end - start;
	return Math.floor(Math.random() * diff + start);
  };
  return (
	<div
	  className="waterfall-item"
	  style={{
		padding: 10,
		width,
		boxSizing: 'border-box',
		backgroundColor: `rgb(${random(100, 200)},${random(150, 200)},${random(180, 200)})`,
	  }}
	>
	  <div>
		<img style={{width: '100%'}} src={item.img} alt={item.title}/>
	  </div>
	  <div className="desc">
		<h3 className="title">{item.title || "我是标题"}</h3>
		<p className="text">{item.desc || "我是描述描述，我是描述我是描述描述，我是描述"}</p>
	  </div>
	</div>
  );
};

export default Index;
