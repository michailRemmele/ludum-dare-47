(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[4],{375:function(e,t,s){"use strict";s.r(t),s.d(t,"effects",function(){return i});var a=s(376),n=s(377),c=s(378),o=s(379);const i={damage:a.default,fetter:n.default,heal:c.default,power:o.default}},376:function(e,t,s){"use strict";s.r(t);var a=s(156);const n="DAMAGE";t.default=class extends a.Effect{constructor(e,t,s){super(),this._gameObject=e,this._messageBus=t,this._value=s.value}apply(){this._messageBus.send({type:n,id:this._gameObject.getId(),gameObject:this._gameObject,value:this._value})}}},377:function(e,t,s){"use strict";s.r(t);var a=s(156);const n="movement";t.default=class extends a.Effect{constructor(e){super(),this._gameObject=e}apply(){const e=this._gameObject.getComponent(n);e&&(e.penalty+=e.speed)}onCancel(){const e=this._gameObject.getComponent(n);e&&(e.penalty-=e.speed)}}},378:function(e,t,s){"use strict";s.r(t);var a=s(156);const n="health";t.default=class extends a.Effect{constructor(e,t,s){super(),this._gameObject=e,this._value=s.value}apply(){const e=this._gameObject.getComponent(n);e&&(e.points+=this._value,e.points>e.maxPoints&&(e.points=e.maxPoints))}}},379:function(e,t,s){"use strict";s.r(t);var a=s(156);const n="weapon";t.default=class extends a.Effect{constructor(e,t,s){super(),this._gameObject=e,this._damage=s.damage,this._range=s.range}apply(){const e=this._gameObject.getComponent(n);e&&(e.properties.damage+=this._damage,e.properties.range+=this._range)}onCancel(){const e=this._gameObject.getComponent(n);e&&(e.properties.damage-=this._damage,e.properties.range-=this._range)}}}}]);