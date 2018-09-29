//生成操作面板

export class PopupNumbers {

    private _$panel: JQuery;
    
    private _targetCell: JQuery|null = null;

    constructor($panel: JQuery) {
        this._$panel = $panel.hide().removeClass('hidden');

        this._$panel.on('click', 'span', e => {
            const $cell = this._targetCell;
            const $span = $(e.target);
            if($span.hasClass('mark1')) {
                if ($cell && $cell.hasClass('mark1')) {
                    $cell.removeClass('mark1');
                } else if($cell){
                    $cell.removeClass('mark2').addClass('mark1');
                }
            }else
            if($span.hasClass('mark2')) {
                if ($cell && $cell.hasClass('mark2')) {
                    $cell.removeClass('mark2');
                } else if($cell){
                    $cell.removeClass('mark1').addClass('mark2');
                }
            }else
            if($cell && $span.hasClass('empty')) {
                $cell.text(0).addClass('empty');
            }else if($cell) {
                $cell.text($span.text()).removeClass('empty');
            }
            this.hide();
        })
    }

    popup($cell: JQuery) {
        this._targetCell = $cell;
        const { left, top } = $cell.position();
        this._$panel.css({
            left: `${left}px`,
            top: `${top}px`
        }).show();
    }

    hide() {
        this._$panel.hide();
    }


}

export default PopupNumbers;