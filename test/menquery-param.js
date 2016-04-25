import test from 'tape'
import _ from 'lodash'
import {Param} from '../src/'

test('MenqueryParam', (t) => {
  let param = (value, options) => new Param('test', value, options)
  let date = new Date('2016-04-24')

  t.test('MenqueryParam constructor type', (st) => {
    let type = (value) => param(value).option('type')
    st.same(type('test'), String, 'should set type string automatically')
    st.same(type(['test']), String, 'should set type string automatically by array')
    st.same(type(123455), Number, 'should set type number automatically')
    st.same(type([123455]), Number, 'should set type number automatically by array')
    st.same(type(false), Boolean, 'should set type boolean automatically')
    st.same(type([false]), Boolean, 'should set type boolean automatically by array')
    st.same(type(new Date()), Date, 'should set type date automatically')
    st.same(type([new Date()]), Date, 'should set type date automatically by array')
    st.same(type(/test/i), RegExp, 'should set type regexp automatically')
    st.same(type([/test/i]), RegExp, 'should set type regexp automatically by array')
    st.end()
  })

  t.test('MenqueryParam constructor options', (st) => {
    let value = (...args) => param(...args).value()
    st.equal(value('foo', {default: 'test'}), 'foo', 'should not set default value string')
    st.equal(value(null, {default: 'test'}), 'test', 'should set default value string')
    st.equal(value(20, {default: 30}), 20, 'should not set default value number')
    st.equal(value(null, {default: () => 30}), 30, 'should set default value number by function')
    st.equal(value(null, {type: String, default: 30}), '30', 'should set default value with different type')
    st.equal(value('Bé_ free!', {normalize: false}), 'Bé_ free!', 'should not normalize value')
    st.equal(value('Bé_ free!', {normalize: true}), 'be free', 'should normalize value')
    st.equal(value('lower', {uppercase: false}), 'lower', 'should not uppercase value')
    st.equal(value('lower', {uppercase: true}), 'LOWER', 'should uppercase value')
    st.equal(value('UPPER', {lowercase: false}), 'UPPER', 'should not lowercase value')
    st.equal(value('UPPER', {lowercase: true}), 'upper', 'should lowercase value')
    st.equal(value('  trim   ', {trim: false}), '  trim   ', 'should not trim value')
    st.equal(value('  trim   ', {trim: true}), 'trim', 'should trim value')
    st.equal(value('123', {get: (value) => value + '!'}), '123!', 'should set getter value')
    st.equal(value('123', {set: (value) => value + '!'}), '123!', 'should set setter value')
    st.end()
  })

  t.test('MenqueryParam constructor options with multiple value', (st) => {
    let value = (value, options) => param(value, _.assign(options, {multiple: true})).value()
    st.same(value('foo,bar', {default: 'test'}), ['foo', 'bar'], 'should not set default value string')
    st.same(value('Bé_!, Bê!', {normalize: false}), ['Bé_!', 'Bê!'], 'should not normalize value')
    st.same(value('Bé_!, Bê!', {normalize: true}), ['be', 'be'], 'should normalize value')
    st.same(value('low,wol', {uppercase: false}), ['low', 'wol'], 'should not uppercase value')
    st.same(value('low,wol', {uppercase: true}), ['LOW', 'WOL'], 'should uppercase value')
    st.same(value('UP,PU', {lowercase: false}), ['UP', 'PU'], 'should not lowercase value')
    st.same(value('UP,PU', {lowercase: true}), ['up', 'pu'], 'should lowercase value')
    st.same(value(' tr ,  rt', {trim: false}), [' tr ', '  rt'], 'should not trim value')
    st.same(value(' tr ,  rt', {trim: true}), ['tr', 'rt'], 'should trim value')
    st.same(value('123,321', {get: (value) => value + '!'}), ['123!', '321!'], 'should set getter value')
    st.same(value('123,321', {set: (value) => value + '!'}), ['123!', '321!'], 'should set setter value')
    st.end()
  })

  t.test('MenqueryParam value', (st) => {
    let value = (val, type) => param(val, {type: type}).value()
    let dateValue = (val) => value(val, Date)
    st.equal(value(23, String), '23', 'should convert 23 to "23"')
    st.equal(value('23', Number), 23, 'should convert "23" to 23')
    st.equal(value('1', Boolean), true, 'should convert "1" to true')
    st.equal(value('0', Boolean), false, 'should convert "0" to false')
    st.equal(value(1, Boolean), true, 'should convert 1 to true')
    st.equal(value(0, Boolean), false, 'should convert 0 to false')
    st.equal(value('true', Boolean), true, 'should convert "true" to true')
    st.equal(value('false', Boolean), false, 'should convert "false" to false')
    st.same(value('test', RegExp), /test/i, 'should convert "test" to /test/i')
    st.same(value(123, RegExp), /123/i, 'should convert 123 to /123/i')
    st.same(dateValue('2016-04-24'), date, 'should convert sameo string to date')
    st.same(dateValue('1461456000000'), date, 'should convert timestamp string to date')
    st.same(dateValue(1461456000000), date, 'should convert number to date')
    st.end()
  })

  t.test('MenqueryParam value with multiple value', (st) => {
    let value = (val, type) => param(val, {type: type, multiple: true}).value()
    let dateValue = (val) => value(val, Date)
    st.same(value('23,24', String), ['23', '24'], 'should convert to string')
    st.same(value('23,24', Number), [23, 24], 'should convert to number')
    st.same(value('1,0,true,false', Boolean), [true, false, true, false], 'should convert to boolean')
    st.same(value('foo,bar', RegExp), [/foo/i, /bar/i], 'should convert to regexp')
    st.same(dateValue('2016-04-24,1461456000000'), [date, date], 'should convert to date')
    value = (val, type) => param(val, {type: [type]}).value()
    st.same(value('23,24', String), ['23', '24'], 'should convert to string with array type')
    st.same(value('23,24', Number), [23, 24], 'should convert to number with array type')
    st.same(value('1,0,true,false', Boolean), [true, false, true, false], 'should convert to boolean with array type')
    st.same(value('foo,bar', RegExp), [/foo/i, /bar/i], 'should convert to regexp with array type')
    st.same(dateValue('2016-04-24,1461456000000'), [date, date], 'should convert to date with array type')
    st.end()
  })

  t.test('MenqueryParam validate', (st) => {
    let validate = (...args) => param(...args).validate()
    let minDate = new Date('2016-01-01')
    let maxDate = new Date('2016-04-25')
    st.true(validate(), 'should validate no options with success')
    st.true(validate(null, {required: false}), 'should validate non required with success')
    st.false(validate(null, {required: true}), 'should validate required with error')
    st.true(validate('test', {required: true}), 'should validate required with success')
    st.true(validate(null, {min: 4}), 'should validate null value min with success')
    st.false(validate(3, {min: 4}), 'should validate min with error')
    st.true(validate(4, {min: 4}), 'should validate min with success')
    st.false(validate(new Date('2015'), {min: minDate}), 'should validate min date with error')
    st.true(validate(minDate, {min: minDate}), 'should validate min date with success')
    st.true(validate(null, {max: 4}), 'should validate null value max with success')
    st.false(validate(5, {max: 4}), 'should validate max with error')
    st.true(validate(4, {max: 4}), 'should validate max with success')
    st.false(validate(new Date('2017'), {max: maxDate}), 'should validate max date with error')
    st.true(validate(maxDate, {max: maxDate}), 'should validate max date with success')
    st.true(validate(null, {minlength: 2}), 'should validate null value minlength with success')
    st.false(validate('a', {minlength: 2}), 'should validate minlength with error')
    st.true(validate('ab', {minlength: 2}), 'should validate minlength with success')
    st.true(validate(null, {maxlength: 2}), 'should validate null value maxlength with success')
    st.false(validate('abc', {maxlength: 2}), 'should validate maxlength with error')
    st.true(validate('ab', {maxlength: 2}), 'should validate maxlength with success')
    st.true(validate(null, {enum: ['ab']}), 'should validate null value enum with success')
    st.false(validate('a', {enum: ['ab']}), 'should validate enum with error')
    st.true(validate('ab', {enum: ['ab']}), 'should validate enum with success')
    st.true(validate(null, {match: /^\D+$/i}), 'should validate null value match with success')
    st.false(validate('3', {match: /^\D+$/i}), 'should validate match with error')
    st.true(validate('ab', {match: /^\D+$/i}), 'should validate match with success')
    st.false(param().validate((err) => err), 'should validate with callback')
    st.end()
  })

  t.test('MenqueryParam validate with multiple value', (st) => {
    let validate = (value, options) => param(value, _.assign(options, {multiple: true})).validate()
    st.false(validate('test,', {required: true}), 'should validate required with error')
    st.true(validate('test', {required: true}), 'should validate required with success')
    st.false(validate('3,4', {min: 4}), 'should validate min with error')
    st.true(validate('4,5', {min: 4}), 'should validate min with success')
    st.false(validate('4,5', {max: 4}), 'should validate max with error')
    st.true(validate('3,4', {max: 4}), 'should validate max with success')
    st.false(validate('ab,a', {minlength: 2}), 'should validate minlength with error')
    st.true(validate('ab,abc', {minlength: 2}), 'should validate minlength with success')
    st.false(validate('ab,abc', {maxlength: 2}), 'should validate maxlength with error')
    st.true(validate('ab,a', {maxlength: 2}), 'should validate maxlength with success')
    st.false(validate('ab,a', {enum: ['ab']}), 'should validate enum with error')
    st.true(validate('ab,ab', {enum: ['ab']}), 'should validate enum with success')
    st.false(validate('ab,3', {match: /^\D+$/i}), 'should validate match with error')
    st.true(validate('ab,a', {match: /^\D+$/i}), 'should validate match with success')
    st.end()
  })

  t.test('MenqueryParam parse', (st) => {
    let parse = (...args) => param(...args).parse()
    st.same(parse(), {}, 'should parse nothing')
    st.same(parse(123), {test: 123}, 'should parse $eq as default')
    st.same(parse('123,456', {multiple: true}), {test: {$in: ['123', '456']}}, 'should parse $in')
    st.same(parse('123', {operator: '$ne'}), {test: {$ne: '123'}}, 'should parse $ne')
    st.same(parse('123,456', {operator: '$ne', multiple: true}), {test: {$nin: ['123', '456']}}, 'should parse $nin')
    st.same(parse(123, {operator: '$gt'}), {test: {$gt: 123}}, 'should parse $gt')
    st.same(parse(123, {operator: '$gte'}), {test: {$gte: 123}}, 'should parse $gte')
    st.same(parse(123, {operator: '$lt'}), {test: {$lt: 123}}, 'should parse $lt')
    st.same(parse(123, {operator: '$lte'}), {test: {$lte: 123}}, 'should parse $lte')
    st.end()
  })

  t.test('MenqueryParam parse $or', (st) => {
    let or = (value, options) => param(value, _.assign({paths: ['p1', 'p2']}, options)).parse()
    let eqMultiple = {$or: [{p1: {$in: ['1', '2']}}, {p2: {$in: ['1', '2']}}]}
    let neMultiple = {$or: [{p1: {$nin: ['1', '2']}}, {p2: {$nin: ['1', '2']}}]}
    st.same(or(123), {$or: [{p1: 123}, {p2: 123}]}, 'should parse $eq')
    st.same(or('1,2', {multiple: true}), eqMultiple, 'should parse $in')
    st.same(or(123, {operator: '$ne'}), {$or: [{p1: {$ne: 123}}, {p2: {$ne: 123}}]}, 'should parse $ne')
    st.same(or('1,2', {operator: '$ne', multiple: true}), neMultiple, 'should parse $nin')
    st.same(or(123, {operator: '$gt'}), {$or: [{p1: {$gt: 123}}, {p2: {$gt: 123}}]}, 'should parse $gt')
    st.same(or(123, {operator: '$gte'}), {$or: [{p1: {$gte: 123}}, {p2: {$gte: 123}}]}, 'should parse $gte')
    st.same(or(123, {operator: '$lt'}), {$or: [{p1: {$lt: 123}}, {p2: {$lt: 123}}]}, 'should parse $lt')
    st.same(or(123, {operator: '$lte'}), {$or: [{p1: {$lte: 123}}, {p2: {$lte: 123}}]}, 'should parse $lte')
    st.end()
  })

  t.test('MenqueryParam option', (st) => {
    let optionParam = param()
    st.true(param().option('paths'), 'should get an option')
    st.false(param().option('test'), 'should not get a nonexistent option')
    st.true(optionParam.option('test', true), 'should set a custom option')
    st.true(optionParam.option('test'), 'should get a custom option')
    st.end()
  })

  t.test('MenqueryParam formatter', (st) => {
    let fParam = param()
    fParam.formatter('capitalize', (capitalize, value, param) => {
      st.equal(param.name, 'test', 'should pass param object to formatter method')
      return capitalize ? _.capitalize(value) : value
    })
    st.true(param().formatter('default'), 'should get formatter')
    st.false(param().formatter('capitalize'), 'should not get nonexistent formatter')
    st.true(fParam.formatter('capitalize'), 'should get custom formatter')
    st.equal(fParam.value('TEST'), 'TEST', 'should not apply custom formatter if option was not set')
    st.true(fParam.option('capitalize', true), 'should set formatter option to true')
    st.equal(fParam.value('TEST'), 'Test', 'should apply custom formatter')
    st.false(fParam.option('capitalize', false), 'should set formatter option to false')
    st.equal(fParam.value('TEST'), 'TEST', 'should not apply custom formatter if option is false')
    st.end()
  })

  t.test('MenqueryParam parser', (st) => {
    let pParam = param(null, {multiple: true})
    pParam.parser('toLower', (toLower, value, param) => {
      st.equal(param.name, 'test', 'should pass param object to parser method')
      return pParam.formatter('lowercase')(toLower, value, param)
    })
    st.false(param().parser('toLower'), 'should not get nonexistent parser')
    st.true(pParam.parser('toLower'), 'should get custom parser')
    st.same(pParam.parse('TEST'), {test: 'TEST'}, 'should not apply custom parser if option was not set')
    st.true(pParam.option('toLower', true), 'should set parser option to true')
    st.same(pParam.parse('TEST'), {test: 'test'}, 'should apply custom parser')
    st.same(pParam.parse('TEST,FOO'), {test: {$in: ['test', 'foo']}}, 'should apply custom parser to multiple values')
    st.false(pParam.option('toLower', false), 'should set parser option to false')
    st.same(pParam.parse('TEST'), {test: 'TEST'}, 'should not apply custom parser if option is false')
    st.end()
  })

  t.test('MenqueryParam validator', (st) => {
    let vParam = param(null, {multiple: true})
    vParam.validator('isPlural', (isPlural, value, param) => {
      st.equal(param.name, 'test', 'should pass param object to validator method')
      return {valid: !isPlural || value.toLowerCase().substr(-1) === 's'}
    })
    st.true(param().validator('required'), 'should get validator')
    st.false(param().validator('isPlural'), 'should not get nonexistent validator')
    st.true(vParam.validator('isPlural'), 'should get custom validator')
    st.true(vParam.validate('test'), 'should not apply custom validator if option was not set')
    st.true(vParam.option('isPlural', true), 'should set validator option to true')
    st.false(vParam.validate('test'), 'should apply custom validator and validate false')
    st.false(vParam.validate('tests,FOO'), 'should apply custom validator to multiple values and validate false')
    st.true(vParam.validate('tests'), 'should apply custom validator and validate true')
    st.true(vParam.validate('tests,FOOS'), 'should apply custom validator to multiple values and validate true')
    st.false(vParam.option('isPlural', false), 'should set validator option to false')
    st.true(vParam.validate('test'), 'should not apply custom validator if option is false')
    st.end()
  })
})
