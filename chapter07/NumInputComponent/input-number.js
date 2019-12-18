function isValueNumber (val) {
    return (/(^-?[0-9]+\.{1}\d+$) | (^-?[1-9][0-9]*$) | (^-?0{1}$)/).test(val + '');
}

Vue.component('input-number', {
    template: '\
        <div class="input-number">\
            <input type="text" :value="currentValue" @change="handleChange">\
            <button @click="handleDown" :disabled="currentValue <= min">-</button>\
            <button @click="handleUp" :disabled="currentValue >= max">+</button>\
        </div>',
    props: {
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        value: {
            type: Number,
            default: 0
        }
    },
    // 组件为单向数据流，故需在子组件中引用父组件中的值
    data: function () {
        return {
            currentValue: this.value
        }
    },
    // 监听currentValue、value值的变化
    watch: {
        currentValue: function (val) {
            // 使用v-model时改变value
            this.$emit('input', val);
            // 触发自定义事件on-change，告知父组件数字输入框的值有所改变
            this.$emit('on-change', val);
        },
        value: function (val) {
            this.updateValue(val);
        }
    },
    methods: {
        updateValue: function (val) {
            if (val > this.max) {
                val = this.max;
            }
            if (val < this.min) {
                val = this.min;
            }
            this.currentValue = val;
        },
        handleDown: function () {
            if (this.currentValue <= this.min) return;
            this.currentValue -= 1;
        },
        handleUp: function () {
            if (this.currentValue >= this.max) return;
            this.currentValue += 1;
        },
        handleChange: function (event) {
            var val = event.target.value.trim();
            var max = this.max;
            var min = this.min;

            if (isValueNumber(val)) {
                val = Number(val);
                this.currentValue = val;

                if (val > max) {
                    this.currentValue = max;
                } else if (val < min) {
                    this.currentValue = min;
                }
            } else {
                event.target.value = this.currentValue;
            }
        }
    },
    mounted: function () {
        // 在第一次初始化时对value进行过滤
        this.updateValue(this.value);
    }
});