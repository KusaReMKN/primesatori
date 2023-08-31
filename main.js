'use strict';

require('dotenv').config();

/** 投稿するインスタンスの URL */
const host = process.env.MASTODON_HOST;

/** アクセストークン (write:statuses) */
const token = process.env.ACCESS_TOKEN;

/**
 * x の約数のうち、2 以上 sqrt(x) 以下で最小のものを求める。
 * 条件に合う約数を持たない場合 (⇒ x が素数の場合)、0 を返す。
 *
 * @param { BigInt } x - テストされる整数
 * @returns { BigInt } テストの結果
 */
function
firstDivisor(x)
{
	for (let i = 2n; i*i <= x; i++)
		if (x % i === 0n)
			return i;
	return 0n;
}

/**
 * 現在時刻を YYYYmmddHHMM の 12 桁の数で表したものが素数であれば投稿を生成する。
 */
function
main()
{
	console.time('main');
	const time = new Date();

	const year = String(time.getFullYear());
	const month = ('0' + (time.getMonth()+1)).slice(-2);	// getMonth returns a 0-based value
	const date = ('0' + time.getDate()).slice(-2);
	const hour = ('0' + time.getHours()).slice(-2);
	const minute = ('0' + time.getMinutes()).slice(-2);

	const timeString = year + month + date + hour + minute;	// YYYYmmddHHMM
	const timeInt = BigInt(timeString);

	const div = firstDivisor(timeInt);
	if (div === 0n) {
		console.error(`${timeInt} is a prime number.`);

		const url = new URL('/api/v1/statuses', host);
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; utf-8',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({
				status: `${timeInt} は素数だよ！`,
				language: 'ja',
			}),
		};
		fetch(url, options)
			.then(res => console.error('\t', res.ok ? 'OK' : 'HTTP ERROR'))
			.catch(err => console.error('\t', err));
	} else {
		console.error(`${timeInt} is not a prime number and is divisible by ${div}.`);
	}

	const now = new Date();
	const second = now.getSeconds();
	const msec = now.getMilliseconds();
	const delay = second * 1000 + msec;
	setTimeout(main, 60000 - delay);
	console.timeEnd('main');
}

main();
